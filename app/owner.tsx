// app/owner.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSalon } from '../context/SalonContext';
import { getTheme } from '../constants/theme';
import { ChatIcon } from '../components/common/ChatIcon';

import { OwnerFloorPage } from '../components/owner/floor';
import { OwnerQueuePage } from '../components/owner/queue';
import { OwnerEarningsPage } from '../components/owner/earnings';
import { OwnerSettingsPage } from '../components/owner/settings';

type OwnerTab = 'floor' | 'queue' | 'earnings' | 'settings';

export default function OwnerScreen() {
  const { isDarkMode, isHindi, ownerPassword } = useSalon();
  const theme = getTheme(isDarkMode);
  
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<OwnerTab>('floor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dynamicBorderColor = isDarkMode ? '#27272A' : '#E4E4E7';
  const dynamicBottomOffset = Math.max(insets.bottom, 12) + 10;
  const dynamicTopPadding = Platform.OS === 'web' ? 0 : Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 28 : 44);

  const handleUnlock = () => {
    if (passwordInput.trim() === String(ownerPassword || 'monu123').trim()) {
      setErrorMsg('');
      setPasswordInput('');
      setIsAuthenticated(true);
    } else {
      setErrorMsg(
        isHindi
          ? 'गलत पासवर्ड! कृपया सही पासवर्ड डालें।'
          : 'Incorrect password! Please try again.'
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.bg, paddingTop: dynamicTopPadding }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <View style={styles.lockContainer}>
          <View
            style={[
              styles.lockCard,
              { backgroundColor: theme.card, borderColor: dynamicBorderColor, width: '90%', maxWidth: 440, alignSelf: 'center' },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
              ]}
            >
              <ChatIcon name="shield" size={28} color={theme.text} />
            </View>

            <Text style={[styles.lockTitle, { color: theme.text }]}>
              {isHindi ? 'ओनर लॉगिन' : 'Owner Portal Login'}
            </Text>
            <Text style={[styles.lockSub, { color: theme.subText }]}>
              {isHindi
                ? 'डैशबोर्ड खोलने के लिए अपना पासवर्ड डालें'
                : 'Enter your password to access Monu Gents Parlour dashboard'}
            </Text>

            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: theme.subCard,
                  color: theme.text,
                  borderColor: errorMsg ? '#EF4444' : dynamicBorderColor,
                },
              ]}
              placeholder={isHindi ? 'पासवर्ड डालें' : 'Enter Password'}
              placeholderTextColor={theme.muted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={passwordInput}
              onChangeText={(txt) => {
                setPasswordInput(txt);
                if (errorMsg) setErrorMsg('');
              }}
              onSubmitEditing={handleUnlock}
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.unlockBtn, { backgroundColor: theme.primaryBtn }]}
              onPress={handleUnlock}
            >
              <Text style={{ color: theme.primaryBtnText, fontWeight: '900', fontSize: 15 }}>
                {isHindi ? 'डैशबोर्ड खोलें' : 'Unlock Dashboard'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelBtn}
              onPress={() => router.replace('/(customer)')}
            >
              <Text style={{ color: theme.subText, fontWeight: '700', fontSize: 13 }}>
                {isHindi ? '← ग्राहक स्क्रीन पर वापस जाएं' : '← Back to Customer View'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const tabs: { id: OwnerTab; label: string; icon?: string; isRupee?: boolean }[] = [
    { id: 'floor', label: isHindi ? 'कुर्सी' : 'Floor', icon: 'chair' },
    { id: 'queue', label: isHindi ? 'कतार' : 'Queue', icon: 'users' },
    { id: 'earnings', label: isHindi ? 'कमाई' : 'Earnings', isRupee: true },
    { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', icon: 'settings' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: dynamicTopPadding }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Un-squeezed Full Width Wrapper */}
      <View style={styles.responsiveWrapper}>
        <View style={[styles.header, { borderBottomColor: dynamicBorderColor }]}>
          <View style={styles.headerLeft}>
            <ChatIcon name="shield" size={20} color={theme.text} />
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {isHindi ? 'एडमिन पैनल' : 'Admin Console'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.lockBtn,
              { backgroundColor: theme.card, borderColor: dynamicBorderColor },
            ]}
            onPress={() => {
              setIsAuthenticated(false);
              router.replace('/(customer)');
            }}
          >
            <Text style={[styles.lockBtnText, { color: theme.text }]}>
              {isHindi ? '← ग्राहक व्यू (लॉक)' : '← Customer View'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          {activeTab === 'floor' && <OwnerFloorPage />}
          {activeTab === 'queue' && <OwnerQueuePage />}
          {activeTab === 'earnings' && <OwnerEarningsPage />}
          {activeTab === 'settings' && <OwnerSettingsPage />}
        </View>
      </View>

      {/* Auto-Adaptive Bottom 4-Tab Pill Dock */}
      <View
        style={[
          styles.bottomDock,
          {
            backgroundColor: theme.card,
            borderColor: dynamicBorderColor,
            bottom: dynamicBottomOffset,
            width: '92%',
            maxWidth: 640,
          },
        ]}
      >
        {tabs.map((t) => {
          const active = activeTab === t.id;
          const contentColor = active ? theme.primaryBtnText : theme.subText;

          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              style={[
                styles.dockTab,
                active && { backgroundColor: theme.primaryBtn },
              ]}
              onPress={() => setActiveTab(t.id)}
            >
              {t.isRupee ? (
                <Text
                  style={{
                    color: contentColor,
                    fontSize: 16,
                    fontWeight: '900',
                    lineHeight: 18,
                  }}
                >
                  ₹
                </Text>
              ) : (
                <ChatIcon name={t.icon as any} size={16} color={contentColor} />
              )}
              <Text
                style={[
                  styles.dockLabel,
                  { color: contentColor },
                  active && { fontWeight: '900' },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    width: '100%',
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  lockCard: {
    padding: 26,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  lockSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 18,
  },
  passwordInput: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  unlockBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 99,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelBtn: {
    marginTop: 18,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  lockBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  lockBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  contentArea: {
    flex: 1,
    width: '100%',
    paddingBottom: 90,
  },
  bottomDock: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 99,
    padding: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  dockTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 99,
  },
  dockLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});