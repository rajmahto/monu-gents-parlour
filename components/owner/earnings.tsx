// components/owner/earnings.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerEarningsPage = () => {
  const { isDarkMode, isHindi, earnings } = useSalon();
  const theme = getTheme(isDarkMode);

  const [filterPeriod, setFilterPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [showLedgerHistory, setShowLedgerHistory] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const formattedDateStr = today.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const currentMonthStr = today.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    month: 'long',
    year: 'numeric',
  });
  const currentYearStr = today.getFullYear().toString();

  const getFilteredData = (period: 'day' | 'week' | 'month' | 'year', chairFilter?: 1 | 2) => {
    return earnings.filter((e) => {
      const entryDateStr = e.date || todayStr;
      const entryDate = new Date(entryDateStr);

      if (chairFilter !== undefined) {
        const matchesChair = chairFilter === 2 ? e.chairId === 2 : (e.chairId === 1 || !e.chairId);
        if (!matchesChair) return false;
      }

      if (period === 'day') return entryDateStr === todayStr;
      if (period === 'week') {
        const diffTime = Math.abs(today.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (period === 'month') {
        return entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
      }
      if (period === 'year') {
        return entryDate.getFullYear() === today.getFullYear();
      }
      return true;
    });
  };

  const currentPeriodEarnings = getFilteredData(filterPeriod);
  const periodTotal = currentPeriodEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const periodCash = currentPeriodEarnings.filter((e) => e.method === 'CASH').reduce((acc, curr) => acc + curr.amount, 0);
  const periodUpi = currentPeriodEarnings.filter((e) => e.method === 'UPI').reduce((acc, curr) => acc + curr.amount, 0);

  const chair1Total = currentPeriodEarnings.filter(e => e.chairId === 1 || !e.chairId).reduce((a, c) => a + c.amount, 0);
  const chair1Count = currentPeriodEarnings.filter(e => e.chairId === 1 || !e.chairId).length;

  const chair2Total = currentPeriodEarnings.filter(e => e.chairId === 2).reduce((a, c) => a + c.amount, 0);
  const chair2Count = currentPeriodEarnings.filter(e => e.chairId === 2).length;

  const serviceStats: Record<string, { count: number; revenue: number; icon: string }> = {
    'Haircut': { count: 0, revenue: 0, icon: 'scissors' },
    'Beard Trim / Shave': { count: 0, revenue: 0, icon: 'shield' },
    'Haircut + Beard Combo': { count: 0, revenue: 0, icon: 'users' },
    'Face Clean-up / Scrub': { count: 0, revenue: 0, icon: 'star' },
  };

  currentPeriodEarnings.forEach((e) => {
    const rawName = e.desc ? e.desc.split('(')[0].trim() : 'Haircut';
    let matchedKey = 'Haircut';
    if (rawName.toLowerCase().includes('shave') || rawName.toLowerCase().includes('trim')) matchedKey = 'Beard Trim / Shave';
    else if (rawName.toLowerCase().includes('combo')) matchedKey = 'Haircut + Beard Combo';
    else if (rawName.toLowerCase().includes('clean') || rawName.toLowerCase().includes('facial')) matchedKey = 'Face Clean-up / Scrub';

    if (!serviceStats[matchedKey]) {
      serviceStats[matchedKey] = { count: 0, revenue: 0, icon: 'scissors' };
    }
    serviceStats[matchedKey].count += 1;
    serviceStats[matchedKey].revenue += e.amount;
  });

  const totalServicesDone = currentPeriodEarnings.length;

  const periodLabels: Record<'day' | 'week' | 'month' | 'year', string> = {
    day: isHindi ? 'आज' : 'TODAY',
    week: isHindi ? 'सप्ताह' : 'WEEK',
    month: isHindi ? 'महीना' : 'MONTH',
    year: isHindi ? 'साल' : 'YEAR',
  };

  const handleExportExcel = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,Token/Desc,Amount,Method,Date,Station\n";
      currentPeriodEarnings.forEach((e) => {
        csvContent += `"${e.desc}",${e.amount},${e.method},${e.date || todayStr},Chair ${e.chairId || 1}\n`;
      });

      if (Platform.OS === 'web') {
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `monu_gents_parlour_${filterPeriod}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert(isHindi ? 'रिपोर्ट डाउनलोड हो गई!' : 'Report Downloaded!', isHindi ? 'एक्सेल/सीएसवी रिपोर्ट सफलतापूर्वक डाउनलोड हो गई है।' : 'Monthly CSV report downloaded successfully.');
      } else {
        Alert.alert(
          isHindi ? 'एक्सेल रिपोर्ट' : 'Monthly Report Export',
          isHindi ? `कुल कमाई: ₹${periodTotal}` : `Total Revenue: ₹${periodTotal}`
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Could not export report.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Current Date Badge */}
      <View style={[styles.dateBadgeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ChatIcon name="calendar" size={16} color={theme.text} />
            <Text style={[styles.dateBadgeText, { color: theme.text }]}>
              {filterPeriod === 'day' && formattedDateStr}
              {filterPeriod === 'week' && (isHindi ? 'पिछले 7 दिन' : 'Last 7 Days')}
              {filterPeriod === 'month' && currentMonthStr}
              {filterPeriod === 'year' && currentYearStr}
            </Text>
          </View>
          <View style={[styles.totalServicesPill, { backgroundColor: theme.subCard, borderColor: theme.border }]}>
            <Text style={{ fontSize: 11, fontWeight: '900', color: theme.text }}>
              {totalServicesDone} {isHindi ? 'सेवाएं' : 'Services'}
            </Text>
          </View>
        </View>
      </View>

      {/* Period Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {(['day', 'week', 'month', 'year'] as const).map((period) => {
          const active = filterPeriod === period;
          return (
            <TouchableOpacity
              key={period}
              style={[styles.filterBtn, active && { backgroundColor: theme.primaryBtn }]}
              onPress={() => setFilterPeriod(period)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: active ? theme.primaryBtnText : theme.subText },
                  active && { fontWeight: '900' },
                ]}
              >
                {periodLabels[period]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MAIN TOTAL STORE REVENUE COUNTER (Liquid Glassy) */}
      <View style={[styles.mainRevenueCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={[styles.kpiLabel, { color: theme.muted }]}>
              {isHindi ? `कुल दुकान की कमाई (${filterPeriod.toUpperCase()})` : `TOTAL STORE REVENUE (${filterPeriod.toUpperCase()})`}
            </Text>
            <Text style={[styles.mainRevenueVal, { color: '#10B981' }]}>₹{periodTotal}</Text>
          </View>
          <View style={[styles.analyticsBadge, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: theme.text }}>₹</Text>
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.splitLabel, { color: theme.subText }]}>Cash: ₹{periodCash}</Text>
            <Text style={[styles.splitLabel, { color: theme.subText }]}>UPI: ₹{periodUpi}</Text>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.subCard }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: '#10B981',
                  width: periodTotal > 0 ? `${(periodCash / periodTotal) * 100}%` : '50%',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* CHAIR 1 & CHAIR 2 LIQUID GLASSY CARDS */}
      <View style={styles.kpiRow}>
        {/* Chair 1 */}
        <View style={[styles.chairSketchCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowBetween}>
            <View style={[styles.chairIconCircle, { backgroundColor: theme.subCard, borderColor: theme.border }]}>
              <ChatIcon name="chair" size={16} color={theme.text} />
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#10B981', opacity: 0.9 }}>₹{chair1Total}</Text>
          </View>

          <View style={styles.chairMiddleRow}>
            <Text style={[styles.chairCountNumber, { color: theme.text }]}>{chair1Count}</Text>
            <Text style={[styles.chairSubLabel, { color: theme.subText }]}>CHAIR 1</Text>
          </View>
        </View>

        {/* Chair 2 */}
        <View style={[styles.chairSketchCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowBetween}>
            <View style={[styles.chairIconCircle, { backgroundColor: theme.subCard, borderColor: theme.border }]}>
              <ChatIcon name="chair" size={16} color={theme.text} />
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#10B981', opacity: 0.9 }}>₹{chair2Total}</Text>
          </View>

          <View style={styles.chairMiddleRow}>
            <Text style={[styles.chairCountNumber, { color: theme.text }]}>{chair2Count}</Text>
            <Text style={[styles.chairSubLabel, { color: theme.subText }]}>CHAIR 2</Text>
          </View>
        </View>
      </View>

      {/* SERVICE SUMMARY 2 * 2 GRID */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 0 }]}>SERVICE SUMMARY</Text>
        <Text style={{ fontSize: 11, color: theme.subText, fontWeight: '700', marginBottom: 14 }}>
          Count & revenue generated per service type
        </Text>

        <View style={styles.serviceGrid}>
          {Object.entries(serviceStats).map(([name, stat], idx) => (
            <View key={idx} style={[styles.serviceBox, { backgroundColor: theme.subCard, borderColor: theme.border }]}>
              <View style={styles.rowBetween}>
                <View style={[styles.serviceCountCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: theme.text }}>{stat.count}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#10B981', opacity: 0.9 }}>₹{stat.revenue}</Text>
              </View>
              <Text style={[styles.serviceBoxTitle, { color: theme.text }]} numberOfLines={1}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TWO BOTTOM ACTION BUTTONS */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.bigActionBtn, { backgroundColor: theme.primaryBtn }]}
          onPress={handleExportExcel}
          activeOpacity={0.85}
        >
          <ChatIcon name="download" size={16} color={theme.primaryBtnText} />
          <Text style={[styles.bigActionBtnText, { color: theme.primaryBtnText }]}>Export Excel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigActionBtn, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}
          onPress={() => setShowLedgerHistory(!showLedgerHistory)}
          activeOpacity={0.85}
        >
          <ChatIcon name="calendar" size={16} color={theme.text} />
          <Text style={[styles.bigActionBtnText, { color: theme.text }]}>
            {showLedgerHistory ? 'Hide Ledger' : 'Ledger History'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Ledger History Section */}
      {showLedgerHistory && (
        <>
          <Text style={[styles.sectionHeader, { color: theme.muted }]}>
            TRANSACTION LEDGER HISTORY ({currentPeriodEarnings.length})
          </Text>
          {currentPeriodEarnings.length === 0 ? (
            <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>No transactions recorded for this {filterPeriod}.</Text>
            </View>
          ) : (
            currentPeriodEarnings.map((e) => (
              <View key={e.id} style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ownerCustName, { color: theme.text }]}>{e.desc}</Text>
                    <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
                      {e.date || 'Today'} • {e.time} • Chair {e.chairId || 1} • {e.method}
                    </Text>
                  </View>
                  <Text style={{ color: '#10B981', fontSize: 18, fontWeight: '900' }}>+₹{e.amount}</Text>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 16, paddingBottom: 160, width: '100%', maxWidth: 720, alignSelf: 'center' },
  dateBadgeCard: { padding: 16, borderRadius: 24, borderWidth: 1, marginBottom: 14, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  dateBadgeText: { fontSize: 13, fontWeight: '800' },
  totalServicesPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  filterContainer: { flexDirection: 'row', borderRadius: 24, padding: 6, marginBottom: 16, borderWidth: 1, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 18, alignItems: 'center' },
  filterText: { fontSize: 11, fontWeight: '800' },
  mainRevenueCard: { padding: 24, borderRadius: 30, borderWidth: 1, marginBottom: 16, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 3 },
  mainRevenueVal: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  kpiLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  analyticsBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  splitLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  progressBarTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  kpiRow: { flexDirection: 'row', gap: 14, marginBottom: 16, width: '100%' },
  chairSketchCard: { flex: 1, padding: 18, borderRadius: 26, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  chairIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  chairMiddleRow: { alignItems: 'center', marginVertical: 8 },
  chairCountNumber: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
  chairSubLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginTop: 2, textAlign: 'center' },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 22, borderRadius: 28, marginBottom: 14, borderWidth: 1, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, width: '100%', justifyContent: 'space-between' },
  serviceBox: { width: '47%', padding: 18, borderRadius: 24, borderWidth: 1 },
  serviceCountCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  serviceBoxTitle: { fontSize: 13, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  actionButtonsRow: { flexDirection: 'row', gap: 14, marginVertical: 16, width: '100%' },
  bigActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  bigActionBtnText: { fontSize: 13, fontWeight: '900' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  ownerCustName: { fontSize: 17, fontWeight: '800', marginTop: 4 },
  ownerCustMeta: { fontSize: 13, marginTop: 3 },
  emptyText: { fontSize: 13, marginTop: 6 },
});