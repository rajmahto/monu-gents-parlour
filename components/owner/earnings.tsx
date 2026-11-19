// components/owner/earnings.tsx
import React, { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';

export const OwnerEarningsPage = () => {
  const {
    isDarkMode,
    isHindi,
    services,
    earnings,
    todayTotal,
    cashTotal,
    upiTotal,
    chair1Booking,
    chair2Booking,
  } = useSalon() as any;

  const theme = getTheme(isDarkMode);
  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  // Dynamically compute count & revenue per active service from earnings records
  const serviceSummaryList = useMemo(() => {
    const activeServices: any[] = Array.isArray(services) ? services : [];
    const allEarnings: any[] = Array.isArray(earnings) ? earnings : [];

    return activeServices.map((srv) => {
      const srvNameLower = String(srv.name || '').trim().toLowerCase();

      const matchingEntries = allEarnings.filter((entry) => {
        if (entry?.entryType === 'MANUAL') return false;
        const descLower = String(entry?.desc || '').toLowerCase();
        return srvNameLower.length > 0 && descLower.includes(srvNameLower);
      });

      const count = matchingEntries.length;
      const revenue = matchingEntries.reduce(
        (sum, item) => sum + (Number(item?.amount) || 0),
        0
      );

      return {
        id: srv.id,
        name: srv.name,
        price: srv.price,
        count,
        revenue,
      };
    });
  }, [services, earnings]);

  const chair1Count = (earnings || []).filter(
    (e: any) => e?.entryType !== 'MANUAL' && e?.chairId === 1
  ).length;
  const chair2Count = (earnings || []).filter(
    (e: any) => e?.entryType !== 'MANUAL' && e?.chairId === 2
  ).length;

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Top Totals Card */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>
          {isHindi ? 'आज की कुल कमाई' : "TODAY'S TOTAL EARNINGS"}
        </Text>
        <Text style={[styles.bigAmount, { color: '#10B981' }]}>₹{todayTotal || 0}</Text>

        <View style={styles.splitRow}>
          <View
            style={[
              styles.miniStatBox,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
          >
            <Text style={[styles.miniLabel, { color: theme.subText }]}>
              {isHindi ? 'नकद (CASH)' : 'CASH'}
            </Text>
            <Text style={[styles.miniValue, { color: theme.text }]}>₹{cashTotal || 0}</Text>
          </View>

          <View
            style={[
              styles.miniStatBox,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
          >
            <Text style={[styles.miniLabel, { color: theme.subText }]}>UPI</Text>
            <Text style={[styles.miniValue, { color: theme.text }]}>₹{upiTotal || 0}</Text>
          </View>
        </View>
      </View>

      {/* Chair Completed Count Row */}
      <View style={styles.chairRow}>
        <View
          style={[
            styles.chairBox,
            { backgroundColor: theme.card, borderColor: dynamicBorderColor },
          ]}
        >
          <Text style={[styles.chairNum, { color: theme.text }]}>
            {chair1Booking ? chair1Count + 1 : chair1Count}
          </Text>
          <Text style={[styles.chairSub, { color: theme.muted }]}>CHAIR 1</Text>
        </View>

        <View
          style={[
            styles.chairBox,
            { backgroundColor: theme.card, borderColor: dynamicBorderColor },
          ]}
        >
          <Text style={[styles.chairNum, { color: theme.text }]}>
            {chair2Booking ? chair2Count + 1 : chair2Count}
          </Text>
          <Text style={[styles.chairSub, { color: theme.muted }]}>CHAIR 2</Text>
        </View>
      </View>

      {/* Dynamic Service Summary Section */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          {isHindi ? 'सर्विस समरी' : 'SERVICE SUMMARY'}
        </Text>
        <Text style={[styles.subCaption, { color: theme.subText }]}>
          {isHindi
            ? `सक्रिय सेवाओं (${serviceSummaryList.length}) के अनुसार काउंट और कमाई`
            : `Count & revenue generated per active service (${serviceSummaryList.length})`}
        </Text>

        {serviceSummaryList.length === 0 ? (
          <Text style={[styles.emptyMsg, { color: theme.muted }]}>
            {isHindi ? 'कोई सक्रिय सेवा नहीं मिली।' : 'No active services found.'}
          </Text>
        ) : (
          <View style={styles.gridWrap}>
            {serviceSummaryList.map((srv) => (
              <View
                key={srv.id}
                style={[
                  styles.serviceBox,
                  { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
                ]}
              >
                <View style={styles.serviceTopRow}>
                  <View
                    style={[
                      styles.countCircle,
                      { backgroundColor: theme.card, borderColor: dynamicBorderColor },
                    ]}
                  >
                    <Text style={[styles.countText, { color: theme.text }]}>{srv.count}</Text>
                  </View>
                  <Text style={[styles.revenueText, { color: '#10B981' }]}>₹{srv.revenue}</Text>
                </View>

                <Text style={[styles.serviceNameText, { color: theme.text }]} numberOfLines={2}>
                  {srv.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons Row */}
      <View style={styles.bottomBtnRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.actionBtn,
            { backgroundColor: theme.primaryBtn, borderColor: dynamicBorderColor },
          ]}
        >
          <Text style={[styles.actionBtnText, { color: theme.primaryBtnText }]}>
            {isHindi ? 'एक्सेल एक्सपोर्ट' : 'Export Excel'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.actionBtn,
            { backgroundColor: theme.card, borderColor: dynamicBorderColor, borderWidth: 1 },
          ]}
        >
          <Text style={[styles.actionBtnText, { color: theme.text }]}>
            {isHindi ? 'लेजर हिस्ट्री' : 'Ledger History'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 160, paddingTop: 12 },
  summaryCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subCaption: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  bigAmount: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 6,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  miniStatBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  miniLabel: { fontSize: 11, fontWeight: '800' },
  miniValue: { fontSize: 18, fontWeight: '900', marginTop: 4 },
  chairRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  chairBox: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chairNum: { fontSize: 22, fontWeight: '900' },
  chairSub: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceBox: {
    width: '48%',
    minHeight: 112,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  serviceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 13, fontWeight: '900' },
  revenueText: { fontSize: 15, fontWeight: '900' },
  serviceNameText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  emptyMsg: { fontSize: 13, fontWeight: '600', paddingVertical: 12 },
  bottomBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { fontSize: 13, fontWeight: '900' },
});