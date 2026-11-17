// components/customer/CustomerView.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { TabType, ServiceItem } from '../../types/database';
import { getResponsivePadding, getMaxContentWidth, isTabletOrDesktop } from '../../utils/responsive';
import { CustomerHomePage } from './home';
import { CustomerTokenPage } from './token';
import { CustomerServicesPage } from './services';
import { CustomerDetailsPage } from './details';
import { ChatIcon } from '../common/ChatIcon';

export const CustomerView = ({ onOpenOwner }: { onOpenOwner: () => void }) => {
  const { isDarkMode, services, bookToken } = useSalon() as any;
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0]);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');

  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const dynamicBottomOffset = Math.max(insets.bottom, 12) + 10;
  const padVal = getResponsivePadding();
  const maxW = getMaxContentWidth();
  const isWide = isTabletOrDesktop();

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.bg }]}>
      <View style={[styles.responsiveWrapper, { paddingHorizontal: padVal, maxWidth: maxW }]}>
        <View style={styles.contentArea}>
          {activeTab === 'home' && (
            <CustomerHomePage
              onNavigate={setActiveTab}
              onOpenBooking={() => setBookingModalOpen(true)}
              onOpenOwner={onOpenOwner}
            />
          )}
          {activeTab === 'token' && <CustomerTokenPage />}
          {activeTab === 'services' && <CustomerServicesPage onNavigate={setActiveTab} />}
          {activeTab === 'details' && <CustomerDetailsPage onOpenOwner={onOpenOwner} />}
        </View>

        {/* iOS Style Liquid Glassy Floating Bottom Nav */}
        <View style={[
          styles.bottomNav, 
          { 
            backgroundColor: isDarkMode ? 'rgba(24, 24, 27, 0.82)' : 'rgba(255, 255, 255, 0.82)', 
            borderColor: dynamicBorderColor, 
            bottom: dynamicBottomOffset,
            maxWidth: isWide ? 600 : '92%',
            width: '92%',
          }
        ]}>
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
                <ChatIcon name={t.icon} size={16} color={active ? theme.primaryBtnText : theme.subText} />
                <Text style={[styles.navTabText, { color: active ? theme.primaryBtnText : theme.subText }, active && { fontWeight: '900' }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal visible={bookingModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: dynamicBorderColor, borderWidth: 1, maxWidth: isWide ? 540 : '100%', alignSelf: 'center', width: '100%' }]}>
            <View style={styles.rowBetween}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: theme.text }}>Get Queue Token</Text>
              <TouchableOpacity onPress={() => setBookingModalOpen(false)}>
                <ChatIcon name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 10, fontWeight: '800', color: theme.muted, marginTop: 12 }}>SELECT SERVICE (10-15 MINS)</Text>
            <View style={{ marginVertical: 12, gap: 10 }}>
              {services.map((s: ServiceItem) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.serviceOption,
                    { backgroundColor: theme.subCard, borderColor: dynamicBorderColor, borderWidth: 1 },
                    selectedService.id === s.id && { borderWidth: 1.5, borderColor: '#10B981' },
                  ]}
                  onPress={() => setSelectedService(s)}
                >
                  <Text style={{ color: theme.text, fontWeight: '700', fontSize: 15 }}>{s.name} (~{s.duration}m)</Text>
                  <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>₹{s.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor }]}
              placeholder="Your Name"
              placeholderTextColor={theme.muted}
              value={custName}
              onChangeText={setCustName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: dynamicBorderColor }]}
              placeholder="10-Digit Mobile Number"
              placeholderTextColor={theme.muted}
              keyboardType="phone-pad"
              maxLength={10}
              value={custPhone}
              onChangeText={setCustPhone}
            />
            <TouchableOpacity
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
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 15 }}>Confirm Booking • ₹{selectedService.price}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: 0,
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  contentArea: {
    flex: 1,
    width: '100%',
  },
  bottomNav: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 99,
    padding: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  navTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 24,
  },
  navTabText: { fontSize: 11, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, fontSize: 14, marginBottom: 14, borderWidth: 1 },
  bookBtn: { paddingVertical: 18, borderRadius: 99, alignItems: 'center', marginTop: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end', padding: 16 },
  modalSheet: { padding: 26, borderTopLeftRadius: 36, borderTopRightRadius: 36, borderRadius: 36 },
  serviceOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 20 },
});