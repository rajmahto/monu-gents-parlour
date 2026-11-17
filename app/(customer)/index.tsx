// app/(customer)/index.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { TabType, ServiceItem } from '../../types/database';
import { CustomerHomePage } from '../../components/customer/home';
import { CustomerTokenPage } from '../../components/customer/token';
import { CustomerServicesPage } from '../../components/customer/services';
import { CustomerDetailsPage } from '../../components/customer/details';
import { ChatIcon } from '../../components/common/ChatIcon';

export default function CustomerIndexScreen() {
  const { isDarkMode, isOnline, services, bookToken } = useSalon() as any;
  const theme = getTheme(isDarkMode);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0]);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');

  const insets = useSafeAreaInsets();
  const dynamicBottomOffset = Math.max(insets.bottom, 12) + 10;
  const dynamicTopPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
  );

  const dynamicBorderColor = isDarkMode ? '#3F3F46' : '#E4E4E7';

  // Jab Shop Closed ho toh Modal kholne se pehle hi Notification dega!
  const handleOpenBookingModal = () => {
    if (!isOnline) {
      Alert.alert(
        'Shop is Currently Closed',
        'Monu Gents Parlour abhi online booking ke liye band hai. Dukan khulne par dobara try karein.'
      );
      return;
    }
    setSelectedService(services[0]);
    setBookingModalOpen(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={{ flex: 1, paddingTop: dynamicTopPadding }}>
        {/* Global Customer Top Bar with Live OPEN / CLOSED Pill */}
        <View style={[styles.globalTopBar, { borderBottomColor: dynamicBorderColor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ChatIcon name="scissors" size={16} color={theme.text} />
            <Text style={[styles.brandTitle, { color: theme.text }]}>
              MONU GENTS PARLOUR
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isOnline ? theme.greenSoft : theme.redSoft,
                borderColor: isOnline ? theme.green : theme.red,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? theme.green : theme.red },
              ]}
            />
            <Text
              style={[
                styles.statusPillText,
                { color: isOnline ? theme.green : theme.red },
              ]}
            >
              {isOnline ? 'SHOP OPEN' : 'CLOSED'}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {activeTab === 'home' && (
            <CustomerHomePage
              onNavigate={setActiveTab}
              onOpenBooking={handleOpenBookingModal}
              onOpenOwner={() => router.push('/owner')}
            />
          )}
          {activeTab === 'token' && <CustomerTokenPage />}
          {activeTab === 'services' && <CustomerServicesPage onNavigate={setActiveTab} />}
          {activeTab === 'details' && (
            <CustomerDetailsPage onOpenOwner={() => router.push('/owner')} />
          )}
        </View>
      </View>

      {/* Auto-Adaptive Bottom 4-Tab Pill Bar */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.card,
            borderColor: dynamicBorderColor,
            bottom: dynamicBottomOffset,
          },
        ]}
      >
        {[
          { id: 'home', label: 'Home', icon: 'chair' },
          { id: 'token', label: 'My token', icon: 'users' },
          { id: 'services', label: 'Service', icon: 'scissors' },
          { id: 'details', label: 'Shop', icon: 'store' },
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              style={[styles.navTab, active && { backgroundColor: theme.primaryBtn }]}
              onPress={() => setActiveTab(t.id as TabType)}
            >
              <ChatIcon
                name={t.icon}
                size={16}
                color={active ? theme.primaryBtnText : theme.subText}
              />
              <Text
                style={[
                  styles.navTabText,
                  { color: active ? theme.primaryBtnText : theme.subText },
                  active && { fontWeight: '900' },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Global Booking Modal */}
      <Modal visible={bookingModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.card,
                borderColor: dynamicBorderColor,
                borderWidth: 1,
                paddingBottom: Math.max(insets.bottom, 16) + 16,
              },
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: theme.text }}>
                Get Queue Token
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setBookingModalOpen(false)}
              >
                <ChatIcon name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: theme.muted,
                marginTop: 12,
              }}
            >
              SELECT SERVICE (10-15 MINS)
            </Text>
            <View style={{ marginVertical: 12, gap: 10 }}>
              {services.map((s: ServiceItem) => (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.8}
                  style={[
                    styles.serviceOption,
                    {
                      backgroundColor: theme.subCard,
                      borderColor: dynamicBorderColor,
                      borderWidth: 1,
                    },
                    selectedService?.id === s.id && {
                      borderWidth: 1.5,
                      borderColor: '#10B981',
                    },
                  ]}
                  onPress={() => setSelectedService(s)}
                >
                  <Text
                    style={{ color: theme.text, fontWeight: '700', fontSize: 15 }}
                  >
                    {s.name} (~{s.duration}m)
                  </Text>
                  <Text
                    style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}
                  >
                    ₹{s.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.subCard,
                  color: theme.text,
                  borderColor: dynamicBorderColor,
                },
              ]}
              placeholder="Your Name"
              placeholderTextColor={theme.muted}
              value={custName}
              onChangeText={setCustName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.subCard,
                  color: theme.text,
                  borderColor: dynamicBorderColor,
                },
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
              style={[styles.bookBtn, { backgroundColor: '#10B981' }]}
              onPress={() => {
                const ok = bookToken(custName, custPhone, selectedService);
                if (ok) {
                  setCustName('');
                  setCustPhone('');
                  setBookingModalOpen(false);
                  setActiveTab('token' as any);
                }
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 15 }}>
                Confirm Booking • ₹{selectedService?.price}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  globalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 99,
    padding: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  navTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderRadius: 99,
  },
  navTabText: { fontSize: 11, fontWeight: '700' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  bookBtn: {
    paddingVertical: 18,
    borderRadius: 99,
    alignItems: 'center',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    padding: 26,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
});