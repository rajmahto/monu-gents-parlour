// components/customer/services.tsx
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ServiceItem } from '../../types/database';

export const CustomerServicesPage = ({ onNavigate }: { onNavigate?: (tab: any) => void }) => {
  const { isDarkMode, isHindi, services, isOnline, bookToken, estWaitMins, waitingQueue } =
    useSalon() as any;
  const theme = getTheme(isDarkMode);

  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    Array.isArray(services) && services.length > 0 ? services[0] : null
  );

  useEffect(() => {
    if (Array.isArray(services) && services.length > 0) {
      if (!selectedService || !services.some((srv) => srv.id === selectedService.id)) {
        setSelectedService(services[0]);
      }
    }
  }, [services, selectedService]);

  const notifyUser = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
      onConfirm?.();
    } else {
      Alert.alert(
        title,
        message,
        onConfirm ? [{ text: 'View My Token', onPress: onConfirm }] : [{ text: 'OK' }]
      );
    }
  };

  const handleBookingAction = () => {
    if (!isOnline) {
      notifyUser(
        isHindi ? 'दुकान अभी बंद है' : 'Shop is Currently Closed',
        isHindi
          ? 'मोनू जेंट्स पार्लर में ऑनलाइन बुकिंग अभी बंद है। कृपया दुकान खुलने पर प्रयास करें।'
          : 'Monu Gents Parlour is currently closed for online bookings. Please try again when the shop opens.'
      );
      return;
    }
    if (!selectedService) {
      notifyUser(
        isHindi ? 'सेवा चुनें' : 'Select Service',
        isHindi ? 'कृपया पहले एक ग्रूमिंग सेवा चुनें।' : 'Please select a grooming service package first.'
      );
      return;
    }
    const success = bookToken(custName, custPhone, selectedService);
    if (success) {
      setCustName('');
      setCustPhone('');
      notifyUser(
        isHindi ? 'टोकन बुक हो गया!' : 'Token Booked Successfully!',
        isHindi
          ? `${selectedService.name} के लिए आपका टोकन कतार में जुड़ गया है। अनुमानित प्रतीक्षा: ~${estWaitMins} मिनट`
          : `Your digital token for ${selectedService.name} is now in the live queue. Estimated Wait: ~${estWaitMins} mins`,
        () => onNavigate?.('token')
      );
    }
  };

  const activeList: ServiceItem[] = Array.isArray(services) ? services : [];

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <View style={styles.topHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pageMainTitle, { color: theme.text }]}>
              {isHindi ? 'रेट कार्ड और पैकेज' : 'Rate Card & Packages'}
            </Text>
            <Text style={[styles.pageSubTitle, { color: theme.subText }]}>
              {isHindi
                ? 'डिजिटल कतार पास लेने के लिए सेवा कार्ड चुनें।'
                : 'Select a grooming service card to reserve your digital queue pass.'}
            </Text>
          </View>

          <View
            style={[
              styles.waitPill,
              { backgroundColor: theme.card, borderColor: dynamicBorderColor },
            ]}
          >
            <Text style={[styles.waitPillLabel, { color: theme.muted }]}>
              {isHindi ? 'प्रतीक्षा' : 'EST. WAIT'}
            </Text>
            <Text style={[styles.waitPillValue, { color: '#10B981' }]}>
              {estWaitMins === 0 ? (isHindi ? 'तुरंत' : 'Now') : `~${estWaitMins}m`}
            </Text>
          </View>
        </View>
      </View>

      {activeList.map((s: ServiceItem) => {
        const isSelected = selectedService?.id === s.id;
        return (
          <TouchableOpacity
            key={s.id}
            activeOpacity={0.85}
            style={[
              styles.serviceBoxCard,
              {
                backgroundColor: theme.card,
                borderColor: isSelected ? '#10B981' : dynamicBorderColor,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedService(s)}
          >
            {s.photoUri && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: s.photoUri }}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
                {isSelected && (
                  <View style={styles.selectedOverlayBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {isHindi ? 'चयनित पैकेज' : 'SELECTED PACKAGE'}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.serviceContent}>
              <View style={styles.rowBetween}>
                <Text style={[styles.serviceName, { color: theme.text }]}>{s.name}</Text>
                <Text style={[styles.servicePrice, { color: '#10B981' }]}>₹{s.price}</Text>
              </View>
              <Text style={[styles.serviceDesc, { color: theme.subText }]}>{s.desc}</Text>

              <View style={[styles.cardFooterRow, { borderTopColor: dynamicBorderColor }]}>
                <Text style={[styles.serviceDuration, { color: theme.muted }]}>
                  {isHindi
                    ? `अनुमानित समय ~${s.duration} मिनट`
                    : `Est. time ~${s.duration} mins`}
                </Text>
                <Text
                  style={[
                    styles.selectActionText,
                    { color: isSelected ? '#10B981' : theme.subText },
                  ]}
                >
                  {isSelected
                    ? isHindi
                      ? '✓ सक्रिय'
                      : '✓ Active'
                    : isHindi
                    ? 'चुनने के लिए टैप करें'
                    : 'Tap to Select'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <View
        style={[
          styles.bookingCard,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor },
        ]}
      >
        <View style={styles.bookingHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
            {selectedService
              ? isHindi
                ? `बुकिंग: ${selectedService.name}`
                : `Booking: ${selectedService.name}`
              : isHindi
              ? 'सेवा चुनें'
              : 'Select a service'}
          </Text>
          {selectedService && (
            <Text style={[styles.bookingPriceTag, { color: '#10B981' }]}>
              ₹{selectedService.price} • ~{selectedService.duration}m
            </Text>
          )}
        </View>

        <Text style={[styles.queueMetaNote, { color: theme.subText }]}>
          {isHindi
            ? `कतार में ${waitingQueue?.length || 0} ग्राहक • अनुमानित प्रतीक्षा: ~${estWaitMins} मिनट`
            : `${waitingQueue?.length || 0} in queue • Estimated wait: ~${estWaitMins} mins`}
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor },
          ]}
          placeholder={isHindi ? 'आपका पूरा नाम' : 'Your Full Name'}
          placeholderTextColor={theme.muted}
          value={custName}
          onChangeText={setCustName}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor },
          ]}
          placeholder={isHindi ? '10 अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'}
          placeholderTextColor={theme.muted}
          keyboardType="phone-pad"
          maxLength={10}
          value={custPhone}
          onChangeText={setCustPhone}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.bookBtn, { backgroundColor: isOnline ? '#10B981' : '#3F3F46' }]}
          onPress={handleBookingAction}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 }}>
            {isOnline
              ? isHindi
                ? 'पुष्टि करें और टोकन लें'
                : 'Confirm & Get Token'
              : isHindi
              ? 'दुकान अभी बंद है'
              : 'Shop is Currently Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 180, paddingTop: 10 },
  headerBlock: { marginBottom: 18 },
  topHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  pageMainTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  pageSubTitle: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  waitPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  waitPillLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  waitPillValue: { fontSize: 15, fontWeight: '900', marginTop: 2 },
  serviceBoxCard: { borderRadius: 32, marginBottom: 20, overflow: 'hidden', borderWidth: 1 },
  imageContainer: { width: '100%', height: 160, position: 'relative' },
  serviceImage: { width: '100%', height: '100%' },
  selectedOverlayBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  selectedBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  serviceContent: { padding: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceName: { fontSize: 18, fontWeight: '900' },
  servicePrice: { fontSize: 20, fontWeight: '900' },
  serviceDesc: { fontSize: 12, marginTop: 6, fontWeight: '600', lineHeight: 18 },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  serviceDuration: { fontSize: 11, fontWeight: '700' },
  selectActionText: { fontSize: 11, fontWeight: '800' },
  bookingCard: { padding: 24, borderRadius: 32, borderWidth: 1, marginTop: 10 },
  bookingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  bookingPriceTag: { fontSize: 13, fontWeight: '900' },
  queueMetaNote: { fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  bookBtn: { paddingVertical: 18, borderRadius: 99, alignItems: 'center', marginTop: 4 },
});