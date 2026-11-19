// components/customer/details.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const CustomerDetailsPage = ({ onOpenOwner }: { onOpenOwner: () => void }) => {
  const {
    isDarkMode,
    setIsDarkMode,
    salonInfo,
    reviews,
    parlourPhotos,
    addParlourPhoto,
  } = useSalon() as any;

  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();
  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null);

  const googleMapsUrl =
    salonInfo?.mapUrl ||
    'https://www.google.com/maps/search/?api=1&query=Monu+Gents+Parlour+Azadnagar+Gomoh+Dhanbad';

  const instagramUrl =
    salonInfo?.instaUrl || 'https://instagram.com/monu_gents_parlour';

  const youtubeUrl =
    salonInfo?.youtubeUrl || 'https://youtube.com/@MonuParlourVlogs';

  const openExternalLink = (url: string, label: string) => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(() => {
      Alert.alert('Notice', `Could not open ${label}.`);
    });
  };

  const totalReviewsCount = reviews?.length || 0;
  const avgRating =
    totalReviewsCount > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) /
          totalReviewsCount
        ).toFixed(1)
      : '5.0';

  const pickGalleryPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Needed', 'Please allow gallery permission.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setNewPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const takeCameraPhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Needed', 'Please allow camera permission.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setNewPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      <View style={styles.headerTopRow}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.pageMainTitle, { color: theme.text }]}>Store & Directory</Text>
          <Text style={[styles.pageSubTitle, { color: theme.subText }]}>
            Studio location, social links & client reviews.
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.cornerAdminBtn,
            { backgroundColor: theme.card, borderColor: dynamicBorderColor },
          ]}
          onPress={onOpenOwner}
          activeOpacity={0.8}
        >
          <ChatIcon name="settings" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.cardBox,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor },
        ]}
      >
        <Text style={[styles.salonNameText, { color: theme.text }]}>
          {salonInfo?.name || 'MONU GENTS PARLOUR'}
        </Text>

        <View style={styles.infoRowBlock}>
          <View style={styles.iconInfoRow}>
            <ChatIcon name="store" size={15} color={theme.subText} />
            <Text style={[styles.infoRow, { color: theme.subText }]}>
              {salonInfo?.address || 'Azadnagar, Gomoh, Dhanbad, Jharkhand'}
            </Text>
          </View>

          {salonInfo?.phone && (
            <View style={styles.iconInfoRow}>
              <ChatIcon name="phone" size={15} color={theme.subText} />
              <Text style={[styles.infoRow, { color: theme.subText }]}>
                +91 {salonInfo.phone}
              </Text>
            </View>
          )}

          <View style={styles.iconInfoRow}>
            <ChatIcon name="calendar" size={15} color={theme.subText} />
            <Text style={[styles.infoRow, { color: theme.subText }]}>
              {salonInfo?.hours || '08:00 AM - 09:00 PM'} • {salonInfo?.closingDay || 'Open All Days'}
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              { backgroundColor: theme.primaryBtn, borderColor: theme.primaryBtn },
            ]}
            onPress={() => openExternalLink(googleMapsUrl, 'Google Maps')}
            activeOpacity={0.85}
          >
            <ChatIcon name="store" size={14} color={theme.primaryBtnText} />
            <Text style={{ color: theme.primaryBtnText, fontWeight: '900', fontSize: 12 }}>
              Directions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
            onPress={() => {
              if (salonInfo?.phone) {
                Linking.openURL(`tel:${salonInfo.phone}`);
              }
            }}
            activeOpacity={0.85}
          >
            <ChatIcon name="phone" size={14} color={theme.text} />
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12 }}>
              Call Studio
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.actionGrid, { marginTop: 10, marginBottom: 18 }]}>
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
            onPress={() => openExternalLink(instagramUrl, 'Instagram')}
            activeOpacity={0.85}
          >
            <View style={[styles.igIconBox, { borderColor: theme.text }]}>
              <View style={[styles.igIconCircle, { borderColor: theme.text }]} />
            </View>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12 }}>
              Instagram
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
            onPress={() => openExternalLink(youtubeUrl, 'YouTube')}
            activeOpacity={0.85}
          >
            <View style={[styles.ytIconBox, { borderColor: theme.text }]}>
              <View style={[styles.ytPlayArrow, { borderLeftColor: theme.text }]} />
            </View>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12 }}>
              YouTube
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.toggleRow, { borderTopColor: dynamicBorderColor }]}>
          <View>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>
              Appearance Theme
            </Text>
            <Text style={{ color: theme.subText, fontSize: 11, marginTop: 2 }}>
              {isDarkMode ? 'Dark Luxury Mode' : 'Light Clean Mode'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#D4D4D8', true: '#10B981' }}
            thumbColor={'#FFFFFF'}
          />
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <View style={[styles.rowBetween, { marginBottom: 12 }]}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>
            Parlour Gallery & Vibe
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.uploadPicBtn,
              { backgroundColor: theme.subCard, borderColor: dynamicBorderColor },
            ]}
            onPress={() => setUploadModalOpen(true)}
          >
            <Text style={{ fontSize: 11, fontWeight: '900', color: theme.text }}>
              + Add Photo
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {parlourPhotos?.map((photo: string, idx: number) => (
            <Image
              key={idx}
              source={{ uri: photo }}
              style={[styles.galleryImage, { borderColor: dynamicBorderColor }]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.cardBox,
          {
            backgroundColor: theme.card,
            borderColor: '#10B981',
            borderWidth: 1.5,
            alignItems: 'center',
            paddingVertical: 24,
            marginBottom: 20,
          },
        ]}
      >
        <View style={styles.googleBadgeTag}>
          <Text style={{ fontSize: 10, fontWeight: '900', color: '#10B981', letterSpacing: 1.2 }}>
            GOOGLE MAPS VERIFIED
          </Text>
        </View>

        <Text style={[styles.salonNameText, { color: theme.text, marginTop: 10, marginBottom: 2 }]}>
          Overall Studio Rating
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginVertical: 4 }}>
          <Text style={{ fontSize: 40, fontWeight: '900', color: theme.text }}>{avgRating}</Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: theme.muted }}>/ 5.0</Text>
        </View>

        <Text style={{ fontSize: 15, color: '#10B981', letterSpacing: 3, marginBottom: 4 }}>
          ★★★★★
        </Text>

        <Text style={{ fontSize: 12, color: theme.subText, fontWeight: '700', marginBottom: 18 }}>
          Based on {totalReviewsCount} verified client ratings
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.googleMapsCleanBtn, { backgroundColor: '#10B981', width: '100%' }]}
          onPress={() => openExternalLink(googleMapsUrl, 'Google Maps')}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
            Rate & View on Google Maps
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 14, marginTop: 4 }}>
        <Text style={[styles.sectionHeading, { color: theme.text, fontSize: 18 }]}>
          Client Feedback ({reviews.length})
        </Text>
      </View>

      {reviews.map((rev: any) => (
        <View
          key={rev.id}
          style={[
            styles.cardBox,
            {
              backgroundColor: theme.card,
              borderColor: dynamicBorderColor,
              padding: 18,
              marginBottom: 12,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.subCard,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: dynamicBorderColor,
                }}
              >
                <Text style={{ fontWeight: '900', color: theme.text, fontSize: 13 }}>
                  {rev.name ? rev.name.charAt(0).toUpperCase() : 'C'}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '900', color: theme.text }}>
                  {rev.name}
                </Text>
                <Text style={{ fontSize: 10, color: theme.muted, fontWeight: '700' }}>
                  {rev.date} • Verified Client
                </Text>
              </View>
            </View>

            <View style={styles.starBadgeMini}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: '#10B981' }}>
                ★ {rev.rating}.0
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 13,
              color: theme.subText,
              marginTop: 10,
              lineHeight: 18,
              fontWeight: '600',
            }}
          >
            "{rev.comment}"
          </Text>

          {rev.photoUri && (
            <Image
              source={{ uri: rev.photoUri }}
              style={{ width: '100%', height: 150, borderRadius: 14, marginTop: 10 }}
              resizeMode="cover"
            />
          )}
        </View>
      ))}

      <Modal visible={uploadModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.card,
                borderColor: dynamicBorderColor,
                paddingBottom: Math.max(insets.bottom, 16) + 16,
              },
            ]}
          >
            <Text style={{ fontSize: 20, fontWeight: '900', color: theme.text, marginBottom: 12 }}>
              Add Parlour Vibe Photo
            </Text>

            {newPhotoUri ? (
              <View>
                <Image
                  source={{ uri: newPhotoUri }}
                  style={{ width: '100%', height: 180, borderRadius: 16, marginBottom: 10 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={{ alignSelf: 'center', marginBottom: 12 }}
                  onPress={() => setNewPhotoUri(null)}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 12 }}>
                    Remove & Choose Another
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                <TouchableOpacity
                  style={[
                    styles.pickImagePlaceholder,
                    {
                      flex: 1,
                      backgroundColor: theme.subCard,
                      borderColor: dynamicBorderColor,
                      marginBottom: 0,
                    },
                  ]}
                  onPress={takeCameraPhoto}
                >
                  <Text style={{ color: theme.text, fontWeight: '900', fontSize: 14 }}>
                    Open Camera
                  </Text>
                  <Text style={{ color: theme.subText, fontSize: 11, marginTop: 4 }}>
                    Click live photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pickImagePlaceholder,
                    {
                      flex: 1,
                      backgroundColor: theme.subCard,
                      borderColor: dynamicBorderColor,
                      marginBottom: 0,
                    },
                  ]}
                  onPress={pickGalleryPhoto}
                >
                  <Text style={{ color: theme.text, fontWeight: '900', fontSize: 14 }}>
                    Open Gallery
                  </Text>
                  <Text style={{ color: theme.subText, fontSize: 11, marginTop: 4 }}>
                    Pick from phone
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <TouchableOpacity
                style={[
                  styles.modalBtnCancel,
                  {
                    backgroundColor: theme.subCard,
                    borderColor: dynamicBorderColor,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  setUploadModalOpen(false);
                  setNewPhotoUri(null);
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '800' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtnConfirm,
                  { backgroundColor: newPhotoUri ? '#10B981' : '#3F3F46' },
                ]}
                onPress={() => {
                  if (!newPhotoUri) {
                    Alert.alert(
                      'Select a Photo',
                      'Please click a photo or choose one from gallery first.'
                    );
                    return;
                  }
                  addParlourPhoto(newPhotoUri);
                  setNewPhotoUri(null);
                  setUploadModalOpen(false);
                  Alert.alert('Uploaded!', 'New parlour photo added to the gallery.');
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '900' }}>Upload Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 180, paddingTop: 14 },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageMainTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  pageSubTitle: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  cornerAdminBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBox: { padding: 22, borderRadius: 30, borderWidth: 1, marginBottom: 20 },
  salonNameText: { fontSize: 20, fontWeight: '900', marginBottom: 14, letterSpacing: 0.5 },
  infoRowBlock: { gap: 10, marginBottom: 20 },
  iconInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoRow: { fontSize: 13, fontWeight: '700', lineHeight: 19, flex: 1 },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPillBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  igIconBox: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  igIconCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.4,
  },
  ytIconBox: {
    width: 17,
    height: 13,
    borderRadius: 3.5,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytPlayArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
  },
  googleBadgeTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  googleMapsCleanBtn: {
    paddingVertical: 15,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: { fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
  galleryImage: { width: 220, height: 140, borderRadius: 20, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  starBadgeMini: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  uploadPicBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { padding: 26, borderTopLeftRadius: 36, borderTopRightRadius: 36, borderWidth: 1 },
  pickImagePlaceholder: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
});