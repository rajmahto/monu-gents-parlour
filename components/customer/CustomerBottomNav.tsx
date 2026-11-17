// components/customer/CustomerBottomNav.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChatIcon } from '../common/ChatIcon';

export type CustomerTabType = 'home' | 'token' | 'services' | 'details';

interface CustomerBottomNavProps {
  activeTab: CustomerTabType;
  setActiveTab: (tab: CustomerTabType) => void;
  theme: any;
}

export const CustomerBottomNav = ({ activeTab, setActiveTab, theme }: CustomerBottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'chair' },
    { id: 'token', label: 'My token', icon: 'users' },
    { id: 'services', label: 'Service', icon: 'scissors' },
    { id: 'details', label: 'Shop', icon: 'store' },
  ];

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {tabs.map((t) => {
        const active = activeTab === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.navTab, active && { backgroundColor: '#FFFFFF' }]}
            onPress={() => setActiveTab(t.id as CustomerTabType)}
          >
            {t.id === 'details' ? (
              // Fallback guaranteed shop indicator dot + clean text
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: active ? '#000000' : theme.subText }} />
            ) : (
              <ChatIcon
                name={t.icon}
                size={16}
                color={active ? '#000000' : theme.subText}
              />
            )}
            <Text
              style={[
                styles.navTabText,
                { color: active ? '#000000' : theme.subText },
                active && { fontWeight: '900' },
              ]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 32,
    padding: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
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
});