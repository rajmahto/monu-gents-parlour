// components/owner/OwnerBottomNav.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChatIcon } from '../common/ChatIcon';

export type OwnerTabType = 'floor' | 'queue' | 'earnings' | 'settings';

interface OwnerBottomNavProps {
  activeTab: OwnerTabType;
  setActiveTab: (tab: OwnerTabType) => void;
  theme: any;
}

export const OwnerBottomNav = ({ activeTab, setActiveTab, theme }: OwnerBottomNavProps) => {
  const tabs = [
    { id: 'floor', label: 'Floor', icon: 'chair' },
    { id: 'queue', label: 'Queue', icon: 'users' },
    { id: 'earnings', label: 'Earnings', icon: 'dollar' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {tabs.map((t) => {
        const active = activeTab === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.navTab, active && { backgroundColor: theme.primaryBtn }]}
            onPress={() => setActiveTab(t.id as OwnerTabType)}
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