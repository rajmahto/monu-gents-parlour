// components/owner/WalkInCard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';

export const OwnerWalkInCard = () => {
  const { isDarkMode, isHindi, services, addWalkIn } = useSalon() as any;
  const theme = getTheme(isDarkMode);
  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const activeServices: any[] = Array.isArray(services) ? services : [];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    activeServices[0]?.id || ''
  );

  useEffect(() => {
    if (
      activeServices.length > 0 &&
      !activeServices.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId(activeServices[0].id);
    }
  }, [activeServices, selectedServiceId]);

  const handleAddWalkIn = () => {
    if (name.trim().length < 2) return;
    addWalkIn(name.trim(), phone.trim(), selectedServiceId);
    setName('');
    setPhone('');
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: dynamicBorderColor },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {isHindi ? 'वॉक-इन टोकन जोड़ें' : 'ADD WALK-IN TOKEN'}
      </Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        {isHindi
          ? 'ग्राहक का नाम और सेवा चुनें'
          : 'Enter customer details & select service'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {activeServices.map((srv) => {
          const isSelected = srv.id === selectedServiceId;
          return (
            <TouchableOpacity
              key={srv.id}
              activeOpacity={0.8}
              onPress={() => setSelectedServiceId(srv.id)}
              style={[
                styles.serviceChip,
                {
                  backgroundColor: isSelected ? theme.primaryBtn : theme.subCard,
                  borderColor: isSelected ? theme.primaryBtn : dynamicBorderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipName,
                  { color: isSelected ? theme.primaryBtnText : theme.text },
                ]}
                numberOfLines={1}
              >
                {srv.name}
              </Text>
              <Text
                style={[
                  styles.chipMeta,
                  { color: isSelected ? theme.primaryBtnText : theme.subText },
                ]}
              >
                ₹{srv.price} • {srv.duration || 15}m
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.subCard,
            color: theme.text,
            borderColor: dynamicBorderColor,
          },
        ]}
        placeholder={isHindi ? 'ग्राहक का नाम' : 'Customer Name'}
        placeholderTextColor={theme.muted}
        value={name}
        onChangeText={setName}
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
        placeholder={isHindi ? 'मोबाइल नंबर (वैकल्पिक)' : 'Mobile Number (optional)'}
        placeholderTextColor={theme.muted}
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleAddWalkIn}
        style={[
          styles.submitBtn,
          {
            backgroundColor:
              name.trim().length >= 2 ? '#10B981' : theme.subCard,
            borderColor: dynamicBorderColor,
          },
        ]}
      >
        <Text
          style={[
            styles.submitText,
            { color: name.trim().length >= 2 ? '#FFFFFF' : theme.muted },
          ]}
        >
          {isHindi ? '+ वॉक-इन टोकन बनाएं' : '+ Generate Walk-In Token'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
    marginBottom: 12,
  },
  chipsRow: {
    gap: 8,
    marginBottom: 14,
  },
  serviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 110,
  },
  chipName: {
    fontSize: 12,
    fontWeight: '800',
  },
  chipMeta: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 13,
    marginBottom: 10,
  },
  submitBtn: {
    paddingVertical: 13,
    borderRadius: 99,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  submitText: {
    fontSize: 13,
    fontWeight: '900',
  },
});