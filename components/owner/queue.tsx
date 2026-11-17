// components/owner/queue.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Linking, Alert } from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerQueuePage = () => {
  const { isDarkMode, isHindi, waitingQueue, addWalkIn, seatCustomer, markNoShow } = useSalon();
  const theme = getTheme(isDarkMode);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');

  const handleManualTokenCreation = () => {
    if (walkInName.trim().length < 2) {
      Alert.alert(
        isHindi ? 'नाम ज़रूरी है' : 'Name Required',
        isHindi ? 'कृपया ग्राहक का नाम डालें।' : 'Please enter walk-in customer name.'
      );
      return;
    }
    addWalkIn(walkInName.trim(), walkInPhone.trim() || '8252870053');
    setWalkInName('');
    setWalkInPhone('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Manual Walk-In Token Generator */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ChatIcon name="users" size={18} color={theme.text} />
          <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
            {isHindi ? 'दुकान पर आए ग्राहक का टोकन बनाएं' : 'MANUAL COUNTER TOKEN GENERATOR'}
          </Text>
        </View>
        <Text style={[styles.ownerCustMeta, { color: theme.subText, marginBottom: 14 }]}>
          {isHindi
            ? 'जिनके पास फोन नहीं है या जो सीधे दुकान पर आए हैं, उनका टोकन यहाँ से बनाएं:'
            : 'Create a token for walk-in customers without smartphones:'}
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'ग्राहक का नाम (Customer Name)' : 'Customer Name'}
          placeholderTextColor={theme.muted}
          value={walkInName}
          onChangeText={setWalkInName}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'मोबाइल नंबर (जरूरी नहीं है)' : 'Mobile Number (Optional)'}
          placeholderTextColor={theme.muted}
          keyboardType="phone-pad"
          maxLength={10}
          value={walkInPhone}
          onChangeText={setWalkInPhone}
        />

        <TouchableOpacity
          style={[styles.whiteBtn, { backgroundColor: theme.primaryBtn }]}
          onPress={handleManualTokenCreation}
        >
          <Text style={[styles.whiteBtnText, { color: theme.primaryBtnText }]}>
            {isHindi ? '+ नया टोकन बनाएं' : '+ Generate Walk-In Token'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Waiting Queue List */}
      <Text style={[styles.sectionHeader, { color: theme.muted }]}>
        {isHindi
          ? `इंतज़ार कर रहे ग्राहक (${waitingQueue.length})`
          : `LIVE WAITING QUEUE (${waitingQueue.length})`}
      </Text>
      {waitingQueue.length === 0 ? (
        <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {isHindi ? 'अभी कतार में कोई ग्राहक नहीं है।' : 'No customers waiting in queue.'}
          </Text>
        </View>
      ) : (
        waitingQueue.map((b, idx) => (
          <View key={b.id} style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.tokenLarge, { color: theme.text }]}>{b.token}</Text>
              <Text style={[styles.queuePosBadge, { color: theme.subText }]}>
                {isHindi ? `नंबर #${idx + 1} • ~${(idx + 1) * 10} मिनट` : `Queue #${idx + 1} • ~${(idx + 1) * 10} min`}
              </Text>
            </View>
            <Text style={[styles.ownerCustName, { color: theme.text }]}>{b.name}</Text>
            <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
              {b.serviceName} (₹{b.price}) • {isHindi ? `समय: ${b.time}` : `Booked at ${b.time}`}
            </Text>

            <View style={[styles.phoneBar, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ChatIcon name="phone" size={14} color={theme.text} />
                <Text style={[styles.phoneBarText, { color: theme.text }]}>{b.phone}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[styles.callNowBtn, { backgroundColor: theme.green }]}
                  onPress={() => Linking.openURL(`tel:${b.phone}`)}
                >
                  <Text style={[styles.callNowBtnText, { color: '#FFFFFF' }]}>
                    {isHindi ? 'कॉल करें' : 'Call'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.skipBtn, { backgroundColor: theme.redSoft }]}
                  onPress={() => markNoShow(b.id)}
                >
                  <Text style={[styles.skipBtnText, { color: theme.red }]}>
                    {isHindi ? 'हटाएं' : 'Skip'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.whiteBtnSmall, { backgroundColor: theme.primaryBtn }]}
                onPress={() => seatCustomer(b.id, 1)}
              >
                <Text style={[styles.whiteBtnSmallText, { color: theme.primaryBtnText }]}>
                  {isHindi ? 'कुर्सी 1 पर बैठाएं' : 'Seat Chair 1'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.whiteBtnSmall, { backgroundColor: theme.primaryBtn }]}
                onPress={() => seatCustomer(b.id, 2)}
              >
                <Text style={[styles.whiteBtnSmallText, { color: theme.primaryBtnText }]}>
                  {isHindi ? 'कुर्सी 2 पर बैठाएं' : 'Seat Chair 2'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 240 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 20, borderRadius: 28, marginBottom: 16, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerCustName: { fontSize: 17, fontWeight: '800', marginTop: 4 },
  ownerCustMeta: { fontSize: 13, marginTop: 3 },
  emptyText: { fontSize: 13, marginTop: 6 },
  tokenLarge: { fontSize: 24, fontWeight: '900' },
  queuePosBadge: { fontSize: 12, fontWeight: '700' },
  phoneBar: {
    padding: 14,
    borderRadius: 20,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  phoneBarText: { fontSize: 14, fontWeight: '800' },
  callNowBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99 },
  callNowBtnText: { fontSize: 12, fontWeight: '800' },
  skipBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99 },
  skipBtnText: { fontSize: 12, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  whiteBtnSmall: { flex: 1, paddingVertical: 12, borderRadius: 99, alignItems: 'center' },
  whiteBtnSmallText: { fontSize: 12, fontWeight: '800' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  whiteBtn: { paddingVertical: 16, borderRadius: 99, alignItems: 'center', marginBottom: 0 },
  whiteBtnText: { fontSize: 15, fontWeight: '900' },
});