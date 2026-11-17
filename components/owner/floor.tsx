// components/owner/floor.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Switch, Modal } from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { Booking } from '../../types/database';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerFloorPage = () => {
  const { isDarkMode, isOnline, setIsOnline, isHindi, chair1Booking, chair2Booking, completeService } = useSalon();

  const theme = getTheme(isDarkMode);
  const dynamicBorderColor = isDarkMode ? '#3F3F46' : '#E4E4E7';

  const [chair1PriceOverride, setChair1PriceOverride] = useState('');
  const [chair2PriceOverride, setChair2PriceOverride] = useState('');
  const [chair1PaymentMethod, setChair1PaymentMethod] = useState<'CASH' | 'UPI'>('CASH');
  const [chair2PaymentMethod, setChair2PaymentMethod] = useState<'CASH' | 'UPI'>('CASH');

  // Confirmation Modal State
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    chairNum: 1 | 2;
    booking: Booking;
    price: number;
    method: 'CASH' | 'UPI';
  } | null>(null);

  const handleTriggerComplete = (chairNum: 1 | 2, booking: Booking) => {
    const override = chairNum === 1 ? chair1PriceOverride : chair2PriceOverride;
    const method = chairNum === 1 ? chair1PaymentMethod : chair2PaymentMethod;
    const finalPrice = override ? Number(override) : booking.price;

    setPendingAction({ chairNum, booking, price: finalPrice, method });
    setConfirmModalVisible(true);
  };

  const confirmAndExecute = () => {
    if (!pendingAction) return;
    const { chairNum, booking, price, method } = pendingAction;

    completeService({ ...booking, price }, method);

    if (chairNum === 1) setChair1PriceOverride('');
    else setChair2PriceOverride('');

    setConfirmModalVisible(false);
    setPendingAction(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Shop Status Banner */}
      <View style={[styles.shopStatusBanner, { backgroundColor: theme.card, borderColor: dynamicBorderColor, borderWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={[styles.statusDotLarge, { backgroundColor: isOnline ? theme.green : theme.red }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: theme.text }]}>
              {isOnline
                ? isHindi
                  ? 'दुकान बुकिंग के लिए खुली है'
                  : 'Shop is OPEN for Bookings'
                : isHindi
                ? 'दुकान अभी बंद है'
                : 'Shop is CURRENTLY CLOSED'}
            </Text>
            <Text style={[styles.bannerSub, { color: theme.subText }]}>
              {isOnline
                ? isHindi
                  ? 'ऑनलाइन टोकन सिस्टम चालू है'
                  : 'Live booking system active'
                : isHindi
                ? 'ऑनलाइन बुकिंग अभी रुकी हुई है'
                : 'Online booking paused'}
            </Text>
          </View>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: '#3F3F46', true: '#10B981' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Text style={[styles.sectionHeader, { color: theme.muted }]}>
        {isHindi ? 'लाइव 2-कुर्सी कंट्रोल सेंटर' : 'LIVE 2-CHAIR COMMAND CENTER'}
      </Text>

      {/* Chairs Boxes */}
      {[1, 2].map((num) => {
        const cBooking = num === 1 ? chair1Booking : chair2Booking;
        const priceOverride = num === 1 ? chair1PriceOverride : chair2PriceOverride;
        const paymentMethod = num === 1 ? chair1PaymentMethod : chair2PaymentMethod;

        return (
          <View key={num} style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: dynamicBorderColor }]}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ChatIcon name="chair" size={18} color={theme.text} />
                <Text style={[styles.ownerChairTitle, { color: theme.text }]}>
                  {isHindi ? `कुर्सी 0${num}` : `CHAIR 0${num}`}
                </Text>
              </View>
              <View style={[styles.miniStatusBadge, { backgroundColor: cBooking ? theme.redSoft : theme.greenSoft }]}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: cBooking ? theme.red : theme.green }}>
                  {cBooking
                    ? `${isHindi ? 'व्यस्त' : 'BUSY'} • ${cBooking.token}`
                    : isHindi
                    ? 'खाली है ✓'
                    : 'VACANT ✓'}
                </Text>
              </View>
            </View>

            {cBooking ? (
              <View style={{ marginTop: 16, gap: 12 }}>
                <View style={[styles.customerBoxHighlight, { backgroundColor: theme.subCard, borderColor: dynamicBorderColor }]}>
                  <Text style={[styles.ownerCustName, { color: theme.text }]}>{cBooking.name}</Text>
                  <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
                    {cBooking.serviceName} • 📞 {cBooking.phone}
                  </Text>
                </View>

                <View style={[styles.priceEditBox, { backgroundColor: theme.subCard, borderColor: dynamicBorderColor }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: theme.muted }}>
                      {isHindi ? 'रकम जांचें / बदलें (₹)' : 'CONFIRM / EDIT PRICE (₹)'}
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, fontWeight: '900', color: theme.text, paddingVertical: 4 }}
                      keyboardType="numeric"
                      placeholder={String(cBooking.price)}
                      placeholderTextColor={theme.muted}
                      value={priceOverride}
                      onChangeText={(val) => {
                        if (num === 1) setChair1PriceOverride(val);
                        else setChair2PriceOverride(val);
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      style={[
                        styles.payMethodBtn,
                        {
                          backgroundColor: paymentMethod === 'CASH' ? theme.green : theme.card,
                          borderColor: dynamicBorderColor,
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => {
                        if (num === 1) setChair1PaymentMethod('CASH');
                        else setChair2PaymentMethod('CASH');
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '900', color: paymentMethod === 'CASH' ? '#FFFFFF' : theme.text }}>
                        {isHindi ? 'नकद (CASH)' : 'CASH'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.payMethodBtn,
                        {
                          backgroundColor: paymentMethod === 'UPI' ? theme.primaryBtn : theme.card,
                          borderColor: dynamicBorderColor,
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => {
                        if (num === 1) setChair1PaymentMethod('UPI');
                        else setChair2PaymentMethod('UPI');
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '900', color: paymentMethod === 'UPI' ? theme.primaryBtnText : theme.text }}>
                        UPI
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.completeActionBtn, { backgroundColor: theme.green }]}
                  onPress={() => handleTriggerComplete(num as 1 | 2, cBooking)}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
                    {isHindi ? 'काम पूरा हुआ (सेव करें)' : 'Mark Service Complete & Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.vacantBox, { backgroundColor: theme.subCard, borderColor: dynamicBorderColor }]}>
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  {isHindi
                    ? 'कुर्सी खाली है। कतार (Queue) टैब से ग्राहक को यहाँ बैठाएं।'
                    : 'Chair is vacant. Assign a waiting customer from the Queue tab.'}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Secure Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: dynamicBorderColor }]}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: theme.text, marginBottom: 8 }}>
              {isHindi ? 'पेमेंट और सर्विस कन्फर्म करें' : 'Confirm Completion'}
            </Text>
            <Text style={{ fontSize: 13, color: theme.subText, fontWeight: '600', lineHeight: 18, marginBottom: 20 }}>
              {isHindi ? 'ग्राहक: ' : 'You are about to complete service for '}
              <Text style={{ fontWeight: '900', color: theme.text }}>{pendingAction?.booking.name}</Text> ({pendingAction?.booking.token}).
              {'\n\n'}
              {isHindi ? 'कुल रकम: ' : 'Amount: '}
              <Text style={{ fontWeight: '900', color: '#10B981' }}>₹{pendingAction?.price}</Text>{' '}
              {isHindi ? 'माध्यम: ' : 'via '}
              <Text style={{ fontWeight: '900', color: theme.text }}>
                {pendingAction?.method === 'CASH' && isHindi ? 'नकद (CASH)' : pendingAction?.method}
              </Text>
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[styles.modalBtnCancel, { backgroundColor: theme.subCard, borderColor: dynamicBorderColor, borderWidth: 1 }]}
                onPress={() => {
                  setConfirmModalVisible(false);
                  setPendingAction(null);
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: '#10B981' }]}
                onPress={confirmAndExecute}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
                  {isHindi ? 'हाँ, सेव करें' : 'Confirm & Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 240 },
  shopStatusBanner: {
    padding: 18,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
    borderWidth: 1,
  },
  statusDotLarge: { width: 14, height: 14, borderRadius: 7 },
  bannerTitle: { fontSize: 15, fontWeight: '900' },
  bannerSub: { fontSize: 12, marginTop: 2 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 20, borderRadius: 28, marginBottom: 16, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerChairTitle: { fontSize: 16, fontWeight: '900' },
  miniStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  customerBoxHighlight: { padding: 14, borderRadius: 18, borderWidth: 1 },
  ownerCustName: { fontSize: 18, fontWeight: '900' },
  ownerCustMeta: { fontSize: 13, marginTop: 4 },
  vacantBox: { padding: 20, borderRadius: 18, borderWidth: 1, marginTop: 12, alignItems: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center' },
  priceEditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  payMethodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeActionBtn: {
    paddingVertical: 16,
    borderRadius: 99,
    alignItems: 'center',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { padding: 26, borderTopLeftRadius: 36, borderTopRightRadius: 36, borderWidth: 1 },
  modalBtnCancel: { flex: 1, paddingVertical: 16, borderRadius: 99, alignItems: 'center' },
  modalBtnConfirm: { flex: 1, paddingVertical: 16, borderRadius: 99, alignItems: 'center' },
});