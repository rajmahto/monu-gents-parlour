// components/owner/earnings.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerEarningsPage = () => {
  const { isDarkMode, isHindi, earnings } = useSalon();
  const theme = getTheme(isDarkMode);

  const [filterPeriod, setFilterPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

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

  const filteredEarnings = earnings.filter((e) => {
    const entryDateStr = e.date || todayStr;
    const entryDate = new Date(entryDateStr);

    if (filterPeriod === 'day') {
      return entryDateStr === todayStr;
    } else if (filterPeriod === 'week') {
      const diffTime = Math.abs(today.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } else if (filterPeriod === 'month') {
      return (
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    } else if (filterPeriod === 'year') {
      return entryDate.getFullYear() === today.getFullYear();
    }
    return true;
  });

  const periodTotal = filteredEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const periodCash = filteredEarnings
    .filter((e) => e.method === 'CASH')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const periodUpi = filteredEarnings
    .filter((e) => e.method === 'UPI')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Service Breakdown calculation for filtered period
  const serviceStats: Record<string, { count: number; revenue: number }> = {};
  filteredEarnings.forEach((e) => {
    const serviceName = e.desc || 'Haircut & Styling';
    if (!serviceStats[serviceName]) {
      serviceStats[serviceName] = { count: 0, revenue: 0 };
    }
    serviceStats[serviceName].count += 1;
    serviceStats[serviceName].revenue += e.amount;
  });

  const periodLabels: Record<'day' | 'week' | 'month' | 'year', string> = {
    day: isHindi ? 'आज' : 'DAY',
    week: isHindi ? 'सप्ताह' : 'WEEK',
    month: isHindi ? 'महीना' : 'MONTH',
    year: isHindi ? 'साल' : 'YEAR',
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Current Date & Period Badge */}
      <View style={[styles.dateBadgeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChatIcon name="calendar" size={16} color={theme.green} />
          <Text style={[styles.dateBadgeText, { color: theme.text }]}>
            {filterPeriod === 'day' && (isHindi ? `आज: ${formattedDateStr}` : `Today: ${formattedDateStr}`)}
            {filterPeriod === 'week' && (isHindi ? `पिछले 7 दिन (${formattedDateStr} तक)` : `Last 7 Days (Ending ${formattedDateStr})`)}
            {filterPeriod === 'month' && (isHindi ? `इस महीने: ${currentMonthStr}` : `Current Month: ${currentMonthStr}`)}
            {filterPeriod === 'year' && (isHindi ? `इस साल: ${currentYearStr}` : `Current Year: ${currentYearStr}`)}
          </Text>
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

      {/* Main Analytical Revenue Card */}
      <View style={[styles.mainRevenueCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={[styles.kpiLabel, { color: theme.muted }]}>
              {isHindi ? `${periodLabels[filterPeriod]} की कुल कमाई` : `${filterPeriod.toUpperCase()} REVENUE ANALYTICS`}
            </Text>
            <Text style={[styles.mainRevenueVal, { color: theme.green }]}>₹{periodTotal}</Text>
          </View>
          <View style={[styles.analyticsBadge, { backgroundColor: theme.greenSoft }]}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: theme.green }}>₹</Text>
          </View>
        </View>

        {/* Cash vs UPI Split Bar */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.splitLabel, { color: theme.subText }]}>
              {isHindi ? `नकद (Cash): ₹${periodCash}` : `Cash: ₹${periodCash}`}
            </Text>
            <Text style={[styles.splitLabel, { color: theme.subText }]}>UPI: ₹{periodUpi}</Text>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.subCard }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: theme.green,
                  width: periodTotal > 0 ? `${(periodCash / periodTotal) * 100}%` : '50%',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Cash & UPI Quick Breakdown Cards */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.kpiLabel, { color: theme.muted }]}>
            {isHindi ? 'नकद कमाई (CASH)' : 'CASH COLLECTION'}
          </Text>
          <Text style={[styles.kpiVal, { color: theme.text }]}>₹{periodCash}</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.kpiLabel, { color: theme.muted }]}>
            {isHindi ? 'ऑनलाइन कमाई (UPI)' : 'UPI COLLECTION'}
          </Text>
          <Text style={[styles.kpiVal, { color: theme.text }]}>₹{periodUpi}</Text>
        </View>
      </View>

      {/* SERVICE BREAKDOWN CARD (Haircut, Shave, etc. Count & Revenue) */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 0 }]}>
          {isHindi ? '서비스 / कटिंग ब्रेकडाउन (Service Breakdown)' : 'SERVICE BREAKDOWN SUMMARY'}
        </Text>
        <Text style={{ fontSize: 11, color: theme.subText, fontWeight: '700', marginBottom: 12 }}>
          {isHindi ? 'किस सर्विस से कितनी कमाई हुई' : 'Count & revenue generated per service type'}
        </Text>

        {Object.keys(serviceStats).length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 13, fontWeight: '600', textAlign: 'center', paddingVertical: 10 }}>
            {isHindi ? 'इस अवधि में कोई सेवा पूरी नहीं हुई।' : 'No services completed during this period.'}
          </Text>
        ) : (
          Object.entries(serviceStats).map(([name, stat], idx) => (
            <View key={idx} style={[styles.breakdownRow, { borderBottomColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: theme.text }}>{name}</Text>
                <Text style={{ fontSize: 11, color: theme.subText, fontWeight: '700', marginTop: 2 }}>
                  {stat.count} {stat.count === 1 ? 'service done' : 'services done'}
                </Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '900', color: theme.green }}>
                ₹{stat.revenue}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Ledger History */}
      <Text style={[styles.sectionHeader, { color: theme.muted }]}>
        {isHindi
          ? `हिसाब-किताब की लिस्ट (${filteredEarnings.length})`
          : `TRANSACTION LEDGER HISTORY (${filteredEarnings.length})`}
      </Text>
      {filteredEarnings.length === 0 ? (
        <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {isHindi ? 'इस समय में कोई कमाई दर्ज नहीं हुई है।' : `No transactions recorded for this ${filterPeriod}.`}
          </Text>
        </View>
      ) : (
        filteredEarnings.map((e) => (
          <View key={e.id} style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.ownerCustName, { color: theme.text }]}>{e.desc}</Text>
                <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
                  {e.date || (isHindi ? 'आज' : 'Today')} • {e.time} • {e.method === 'CASH' && isHindi ? 'नकद' : e.method}
                </Text>
              </View>
              <Text style={{ color: theme.green, fontSize: 18, fontWeight: '900' }}>
                +₹{e.amount}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 160 },
  dateBadgeCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  dateBadgeText: { fontSize: 13, fontWeight: '800' },
  filterContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },
  filterText: { fontSize: 11, fontWeight: '800' },
  mainRevenueCard: {
    padding: 22,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
  },
  mainRevenueVal: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  analyticsBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  splitLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  progressBarTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  kpiCard: { flex: 1, padding: 18, borderRadius: 24, borderWidth: 1 },
  kpiLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  kpiVal: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 20, borderRadius: 28, marginBottom: 14, borderWidth: 1 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerCustName: { fontSize: 17, fontWeight: '800', marginTop: 4 },
  ownerCustMeta: { fontSize: 13, marginTop: 3 },
  emptyText: { fontSize: 13, marginTop: 6 },
});