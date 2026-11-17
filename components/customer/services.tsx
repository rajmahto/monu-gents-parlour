// components/customer/services.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ServiceItem } from '../../types/database';

export const CustomerServicesPage = ({ onNavigate }: { onNavigate?: (tab: any) => void }) => {
  const { isDarkMode, services, isOnline, bookToken, estWaitMins } = useSalon() as any;
  const theme = getTheme(isDarkMode);

  const dynamicBorderColor = isDarkMode ? '#3F3F46' : '#E4E4E7';

  // Booking Form States
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0]);

  const handleBookingAction = () => {
    if (!isOnline) {
      Alert.alert(
        'Shop is Currently Closed',
        'Monu Gents Parlour is currently closed for online bookings. Please try again when the shop opens.'
      );
      return;
    }
    if (!selectedService) {
      Alert.alert('Select Service', 'Please select a grooming service package first.');
      return;
    }
    const success = bookToken(custName, custPhone, selectedService);
    if (success) {
      setCustName('');
      setCustPhone('');
      Alert.alert(
        'Token Booked Successfully!',
        `Your digital token is now in the live queue. Estimated Wait: ~${estWaitMins} mins`,
        [
          {
            text: 'View My Token',
            onPress: () => onNavigate?.('token'),
          },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={[styles.pageMainTitle, { color: theme.text }]}>Rate Card & Packages</Text>
        <Text style={[styles.pageSubTitle, { color: theme.subText }]}>
          Select a grooming service card to reserve your digital queue pass.
        </Text>
      </View>

      {services.map((s: ServiceItem) => {
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
                <Image source={{ uri: s.photoUri }} style={styles.serviceImage} resizeMode="cover" />
                {isSelected && (
                  <View style={styles.selectedOverlayBadge}>
                    <Text style={styles.selectedBadgeText}>SELECTED PACKAGE</Text>
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
                  Est. time ~{s.duration} mins
                </Text>
                <Text
                  style={[
                    styles.selectActionText,
                    { color: isSelected ? '#10B981' : theme.subText },
                  ]}
                >
                  {isSelected ? '✓ Active' : 'Tap to Select'}
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
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {selectedService ? `Booking: ${selectedService.name}` : 'Select a service'}
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor },
          ]}
          placeholder="Your Full Name"
          placeholderTextColor={theme.muted}
          value={custName}
          onChangeText={setCustName}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor },
          ]}
          placeholder="10-Digit Mobile Number"
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
            {isOnline ? 'Confirm & Get Token' : 'Shop is Currently Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 160, paddingTop: 10 },
  headerBlock: { marginBottom: 18 },
  pageMainTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  pageSubTitle: { fontSize: 13, fontWeight: '700', marginTop: 3 },
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