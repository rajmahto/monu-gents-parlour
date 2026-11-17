// app/owner/rates.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerRatesPage = () => {
  const { isDarkMode, services, updateServicePrice, addNewService } = useSalon();
  const theme = getTheme(isDarkMode);

  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState('');
  const [newSrvDuration, setNewSrvDuration] = useState('15');

  const handleAddService = () => {
    const priceVal = Number(newSrvPrice);
    const durationVal = Number(newSrvDuration) || 15;

    if (!newSrvName.trim() || !priceVal) {
      Alert.alert('Missing Details', 'Service ka naam aur price sahi se daalein.');
      return;
    }

    addNewService(newSrvName.trim(), priceVal, durationVal);
    setNewSrvName('');
    setNewSrvPrice('');
    setNewSrvDuration('15');
    Alert.alert('Success! ✂️', 'Naya service rate card mein successfully add ho gaya hai.');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* 1. Add New Service Card with Depth & Border */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ChatIcon name="scissors" size={20} color={theme.text} />
          <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
            ADD NEW SERVICE & RATE
          </Text>
        </View>
        <Text style={[styles.ownerCustMeta, { color: theme.subText, marginBottom: 14 }]}>
          Naya haircut ya grooming service yahan add karein:
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder="Service Name (e.g. Hair Colour, Detan)"
          placeholderTextColor={theme.muted}
          value={newSrvName}
          onChangeText={setNewSrvName}
        />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
            placeholder="Price (₹)"
            placeholderTextColor={theme.muted}
            keyboardType="numeric"
            value={newSrvPrice}
            onChangeText={setNewSrvPrice}
          />
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
            placeholder="Mins (e.g. 15)"
            placeholderTextColor={theme.muted}
            keyboardType="numeric"
            value={newSrvDuration}
            onChangeText={setNewSrvDuration}
          />
        </View>

        <TouchableOpacity
          style={[styles.whiteBtn, { backgroundColor: theme.primaryBtn }]}
          onPress={handleAddService}
        >
          <Text style={[styles.whiteBtnText, { color: theme.primaryBtnText }]}>
            + Add to Rate Card
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Existing Rate Card with Separation Borders */}
      <Text style={[styles.sectionHeader, { color: theme.muted }]}>
        ACTIVE RATE CARD & QUICK PRICE ADJUSTMENT (-₹5 / +₹5)
      </Text>
      
      {services.map((s) => (
        <View key={s.id} style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ownerCustName, { color: theme.text }]}>{s.name}</Text>
              <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
                Est. Duration: ~{s.duration} mins • {s.desc}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={[styles.priceAdjustBtn, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => updateServicePrice(s.id, -5)}
              >
                <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>-5</Text>
              </TouchableOpacity>
              
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '900', minWidth: 40, textAlign: 'center' }}>
                ₹{s.price}
              </Text>

              <TouchableOpacity
                style={[styles.priceAdjustBtn, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => updateServicePrice(s.id, 5)}
              >
                <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 130 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 20, borderRadius: 28, marginBottom: 16, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerCustName: { fontSize: 17, fontWeight: '800', marginTop: 4 },
  ownerCustMeta: { fontSize: 13, marginTop: 3 },
  priceAdjustBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    fontSize: 14,
    marginBottom: 14,
  },
  whiteBtn: { paddingVertical: 16, borderRadius: 99, alignItems: 'center', marginBottom: 0 },
  whiteBtnText: { fontSize: 15, fontWeight: '900' },
});