// components/owner/settings.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const OwnerSettingsPage = ({
  isHindiProp,
  setIsHindiProp,
}: {
  isHindiProp?: boolean;
  setIsHindiProp?: (v: boolean) => void;
}) => {
  const salonCtx = useSalon() as any;
  const {
    isDarkMode,
    salonInfo,
    setSalonInfo,
    services,
    deleteService,
    updateServicePrice,
    addNewService,
    isOnline,
    setIsOnline,
  } = salonCtx;

  const theme = getTheme(isDarkMode);

  const isHindi = salonCtx.isHindi ?? isHindiProp ?? false;
  const setIsHindi = salonCtx.setIsHindi ?? setIsHindiProp;

  const actualOwnerPass = salonCtx.ownerPassword || 'monu123';
  const setActualOwnerPass = salonCtx.setOwnerPassword;

  // New Service Form States
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');

  // Social & Maps Links States
  const [mapLinkInput, setMapLinkInput] = useState(salonInfo?.mapUrl || '');
  const [instaLinkInput, setInstaLinkInput] = useState(
    salonInfo?.instaUrl || 'https://instagram.com/monu_gents_parlour'
  );
  const [youtubeLinkInput, setYoutubeLinkInput] = useState(
    salonInfo?.youtubeUrl || 'https://youtube.com/@MonuParlourVlogs'
  );

  // Password Management States
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  const pickHeroPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        isHindi ? 'अनुमति आवश्यक है' : 'Permission Needed',
        isHindi ? 'फोटो चुनने के लिए गैलरी की अनुमति दें।' : 'Gallery access required.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setSalonInfo((prev: any) => ({ ...prev, ownerPortrait: result.assets[0].uri }));
      Alert.alert(
        isHindi ? 'फोटो बदल गई' : 'Photo Updated',
        isHindi ? 'होम स्क्रीन की फोटो सफलतापूर्वक अपडेट हो गई है।' : 'Hero portrait updated successfully.'
      );
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServicePrice) {
      Alert.alert(
        isHindi ? 'जानकारी अधूरी है' : 'Missing Details',
        isHindi ? 'कृपया सर्विस का नाम और रेट (कीमत) डालें।' : 'Please enter service name and price.'
      );
      return;
    }
    addNewService(newServiceName.trim(), Number(newServicePrice), Number(newServiceDuration) || 15);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDuration('');
    Alert.alert(
      isHindi ? 'सर्विस जुड़ गई' : 'Service Added',
      isHindi ? 'नई सर्विस रेट कार्ड में जोड़ दी गई है।' : 'New service added to rate card.'
    );
  };

  const handleSaveSocialLinks = () => {
    setSalonInfo((prev: any) => ({
      ...prev,
      mapUrl: mapLinkInput.trim(),
      instaUrl: instaLinkInput.trim(),
      youtubeUrl: youtubeLinkInput.trim(),
    }));
    Alert.alert(
      isHindi ? 'लिंक सेव हो गए' : 'Links Updated',
      isHindi
        ? 'गूगल मैप्स, इंस्टाग्राम और यूट्यूब लिंक अपडेट हो गए हैं।'
        : 'Google Maps, Instagram, and YouTube links saved successfully.'
    );
  };

  const handlePasswordChange = () => {
    if (currentPassInput !== actualOwnerPass) {
      Alert.alert(
        isHindi ? 'गलत पासवर्ड' : 'Error',
        isHindi ? 'आपका पुराना पासवर्ड गलत है!' : 'Current password is incorrect!'
      );
      return;
    }
    if (newPassInput.length < 4) {
      Alert.alert(
        isHindi ? 'छोटा पासवर्ड' : 'Error',
        isHindi ? 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'New password must be at least 4 characters.'
      );
      return;
    }
    if (newPassInput !== confirmPassInput) {
      Alert.alert(
        isHindi ? 'पासवर्ड मैच नहीं हुआ' : 'Error',
        isHindi ? 'नया पासवर्ड और कन्फर्म पासवर्ड एक जैसे नहीं हैं।' : 'New password and confirm password do not match.'
      );
      return;
    }

    if (setActualOwnerPass) {
      setActualOwnerPass(newPassInput);
    }
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    Alert.alert(
      isHindi ? 'पासवर्ड बदल गया' : 'Password Updated',
      isHindi ? 'आपका एडमिन पासवर्ड सफलतापूर्वक बदल गया है।' : 'Admin password updated successfully.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* 0. App Language Switcher */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
          {isHindi ? 'ऐप की भाषा / APP LANGUAGE' : 'APP LANGUAGE / ऐप की भाषा'}
        </Text>
        <Text style={[styles.ownerCustMeta, { color: theme.subText, marginBottom: 14 }]}>
          {isHindi
            ? 'पूरे ओनर कंट्रोल पैनल की भाषा यहाँ से बदलें:'
            : 'Choose language for the entire Owner Portal:'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.langOptionBtn,
              {
                backgroundColor: !isHindi ? theme.primaryBtn : theme.subCard,
                borderColor: !isHindi ? theme.green : theme.border,
              },
            ]}
            onPress={() => setIsHindi?.(false)}
          >
            <Text
              style={{
                color: !isHindi ? theme.primaryBtnText : theme.text,
                fontWeight: '900',
                fontSize: 14,
              }}
            >
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.langOptionBtn,
              {
                backgroundColor: isHindi ? theme.primaryBtn : theme.subCard,
                borderColor: isHindi ? theme.green : theme.border,
              },
            ]}
            onPress={() => setIsHindi?.(true)}
          >
            <Text
              style={{
                color: isHindi ? theme.primaryBtnText : theme.text,
                fontWeight: '900',
                fontSize: 14,
              }}
            >
              हिंदी (Hindi)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Instant Shop Status Toggle (Emoji-Free) */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.ownerCustName, { color: theme.text }]}>
              {isHindi ? 'दुकान खोलें / बंद करें' : 'Instant Shop Status'}
            </Text>
            <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
              {isOnline
                ? isHindi
                  ? 'दुकान अभी बुकिंग के लिए खुली (OPEN) है'
                  : 'Shop is currently OPEN'
                : isHindi
                ? 'दुकान अभी बंद (CLOSED) है'
                : 'Shop is currently CLOSED'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.statusToggleBtn,
              {
                backgroundColor: isOnline ? theme.greenSoft : theme.redSoft,
                borderColor: isOnline ? theme.green : theme.red,
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              },
            ]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isOnline ? theme.green : theme.red,
              }}
            />
            <Text style={{ fontWeight: '900', fontSize: 12, color: isOnline ? theme.green : theme.red }}>
              {isOnline ? (isHindi ? 'खुली है' : 'OPEN') : isHindi ? 'बंद है' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Rate Card & Services Management */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ChatIcon name="scissors" size={18} color={theme.text} />
          <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
            {isHindi ? 'रेट लिस्ट और सेवाएं (SERVICES)' : 'MANAGE RATES & SERVICES'}
          </Text>
        </View>

        {services.map((s: any) => (
          <View
            key={s.id}
            style={[styles.serviceRow, { backgroundColor: theme.subCard, borderColor: theme.border, borderWidth: 1 }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.ownerCustName, { color: theme.text }]}>{s.name}</Text>
              <Text style={[styles.ownerCustMeta, { color: theme.subText }]}>
                ₹{s.price} • ~{s.duration} {isHindi ? 'मिनट' : 'm'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={[styles.priceControlBtn, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => updateServicePrice(s.id, -10)}
              >
                <Text style={{ color: theme.text, fontWeight: '900' }}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priceControlBtn, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => updateServicePrice(s.id, 10)}
              >
                <Text style={{ color: theme.text, fontWeight: '900' }}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: theme.redSoft }]}
                onPress={() => deleteService(s.id)}
              >
                <Text style={{ color: theme.red, fontWeight: '900', fontSize: 12 }}>
                  {isHindi ? 'हटाएं' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Service Form */}
        <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 16 }]}>
          {isHindi ? 'नई सर्विस जोड़ें' : 'ADD NEW SERVICE'}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'सर्विस का नाम (जैसे: हेयर कलर)' : 'Service Name (e.g., Hair Coloring)'}
          placeholderTextColor={theme.muted}
          value={newServiceName}
          onChangeText={setNewServiceName}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
            placeholder={isHindi ? 'रेट (₹)' : 'Price (₹)'}
            placeholderTextColor={theme.muted}
            keyboardType="numeric"
            value={newServicePrice}
            onChangeText={setNewServicePrice}
          />
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
            placeholder={isHindi ? 'समय (मिनट में)' : 'Duration (mins)'}
            placeholderTextColor={theme.muted}
            keyboardType="numeric"
            value={newServiceDuration}
            onChangeText={setNewServiceDuration}
          />
        </View>
        <TouchableOpacity style={[styles.whiteBtn, { backgroundColor: theme.green }]} onPress={handleAddService}>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
            {isHindi ? '+ रेट कार्ड में नई सर्विस जोड़ें' : '+ Add Service to Rate Card'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Social Media & Google Maps Links Configuration */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
          {isHindi
            ? 'गूगल मैप्स, इंस्टाग्राम और यूट्यूब लिंक'
            : 'GOOGLE MAPS, INSTAGRAM & YOUTUBE LINKS'}
        </Text>
        <Text style={[styles.ownerCustMeta, { color: theme.subText, marginBottom: 14 }]}>
          {isHindi
            ? 'यहाँ अपने लिंक डालें जो ग्राहक को Shop पेज के आइकॉन पर क्लिक करने से खुलेंगे:'
            : 'Configure links opened when customers tap the icons on the Shop page:'}
        </Text>

        {/* Google Maps Input */}
        <Text style={[styles.inputLabelText, { color: theme.subText }]}>
          {isHindi ? 'Google Maps और Review लिंक' : 'Google Maps & Review Link'}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder="https://maps.app.goo.gl/..."
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          value={mapLinkInput}
          onChangeText={setMapLinkInput}
        />

        {/* Instagram Input */}
        <Text style={[styles.inputLabelText, { color: theme.subText }]}>
          {isHindi ? 'Instagram प्रोफाइल लिंक' : 'Instagram Profile Link'}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder="https://instagram.com/monu_gents_parlour"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          value={instaLinkInput}
          onChangeText={setInstaLinkInput}
        />

        {/* YouTube Input */}
        <Text style={[styles.inputLabelText, { color: theme.subText }]}>
          {isHindi ? 'YouTube चैनल लिंक' : 'YouTube Channel Link'}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder="https://youtube.com/@MonuParlourVlogs"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          value={youtubeLinkInput}
          onChangeText={setYoutubeLinkInput}
        />

        <TouchableOpacity style={[styles.whiteBtn, { backgroundColor: theme.primaryBtn }]} onPress={handleSaveSocialLinks}>
          <Text style={[styles.whiteBtnText, { color: theme.primaryBtnText }]}>
            {isHindi ? 'तीनों लिंक सेव करें' : 'Save Social & Map Links'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Hero Model Photo Upload */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
          {isHindi ? 'होम स्क्रीन की मुख्य फोटो (HERO PHOTO)' : 'HOME SCREEN HERO MODEL PHOTO'}
        </Text>
        <Image
          source={{ uri: salonInfo.ownerPortrait }}
          style={{ width: '100%', height: 180, borderRadius: 20, marginBottom: 14 }}
          resizeMode="cover"
        />
        <TouchableOpacity style={[styles.whiteBtn, { backgroundColor: theme.primaryBtn }]} onPress={pickHeroPhoto}>
          <Text style={[styles.whiteBtnText, { color: theme.primaryBtnText }]}>
            {isHindi ? 'गैलरी से नई फोटो अपलोड करें' : 'Upload New Photo from Gallery'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. Secure Password Change Section */}
      <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ChatIcon name="shield" size={18} color={theme.text} />
          <Text style={[styles.sectionHeader, { color: theme.muted, marginTop: 0 }]}>
            {isHindi ? 'एडमिन पासवर्ड बदलें' : 'ADMIN PASSWORD MANAGEMENT'}
          </Text>
        </View>
        <Text style={[styles.ownerCustMeta, { color: theme.subText, marginBottom: 14 }]}>
          {isHindi
            ? 'पुराना पासवर्ड डालकर अपना नया पासवर्ड सेट करें:'
            : 'Confirm current password to set a new secure admin password:'}
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'पुराना पासवर्ड (Current Password)' : 'Current Password'}
          placeholderTextColor={theme.muted}
          secureTextEntry
          autoCapitalize="none"
          value={currentPassInput}
          onChangeText={setCurrentPassInput}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'नया पासवर्ड (कम से कम 4 अक्षर)' : 'New Password (min 4 chars)'}
          placeholderTextColor={theme.muted}
          secureTextEntry
          autoCapitalize="none"
          value={newPassInput}
          onChangeText={setNewPassInput}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.subCard, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder={isHindi ? 'नया पासवर्ड दोबारा डालें' : 'Confirm New Password'}
          placeholderTextColor={theme.muted}
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassInput}
          onChangeText={setConfirmPassInput}
        />

        <TouchableOpacity style={[styles.whiteBtn, { backgroundColor: theme.green }]} onPress={handlePasswordChange}>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
            {isHindi ? 'पासवर्ड सेव करें' : 'Update Password Securely'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 180 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginVertical: 12 },
  ownerCard: { padding: 20, borderRadius: 28, marginBottom: 16, borderWidth: 1 },
  ownerCustName: { fontSize: 16, fontWeight: '800' },
  ownerCustMeta: { fontSize: 13, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusToggleBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  langOptionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceRow: {
    padding: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  priceControlBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  inputLabelText: { fontSize: 11, fontWeight: '800', marginBottom: 6, marginLeft: 4 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  whiteBtn: { paddingVertical: 16, borderRadius: 99, alignItems: 'center', marginBottom: 0 },
  whiteBtnText: { fontSize: 15, fontWeight: '900' },
});