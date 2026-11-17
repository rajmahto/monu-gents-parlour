// components/customer/home.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const CustomerHomePage = ({
  onNavigate,
  onOpenBooking,
  onOpenOwner,
}: {
  onNavigate: (tab: any) => void;
  onOpenBooking: () => void;
  onOpenOwner: () => void;
}) => {
  const {
    isDarkMode,
    isOnline,
    salonInfo,
    chair1Booking,
    chair2Booking,
    waitingQueue,
    estWaitMins,
  } = useSalon() as any;
  const theme = getTheme(isDarkMode);

  const dynamicBorderColor = isDarkMode ? '#3F3F46' : '#E4E4E7';

  // 1-sec Flashing Recording Light Animation for Occupied Chairs
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Smooth Entry Animation for Hero Text
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Rotating Brand Titles Array
  const brandTitles = [
    { main: 'MONU', letter: 'G', rest: 'ENTS', parlour: 'PARLOUR' },
    { main: 'SHARP', letter: 'F', rest: 'ADE', parlour: 'STUDIO' },
    { main: 'LUXURY', letter: 'B', rest: 'EARD', parlour: 'EXPERTS' },
  ];

  const [titleIndex, setTitleIndex] = useState(0);
  const titleFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Blinking loop for red dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    // Hero Text Entrance Effect
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    // 30-Second Brand Title Rotation Effect
    const interval = setInterval(() => {
      Animated.timing(titleFadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setTitleIndex((prev) => (prev + 1) % brandTitles.length);
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [pulseAnim, fadeAnim, slideAnim, titleFadeAnim]);

  const [secretTapCount, setSecretTapCount] = useState(0);
  const handleBrandSecretTap = () => {
    const next = secretTapCount + 1;
    if (next >= 5) {
      setSecretTapCount(0);
      onOpenOwner();
    } else {
      setSecretTapCount(next);
    }
  };

  const currentTitle = brandTitles[titleIndex];

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      {/* Sketch Hero (Clean Flat Typography without 3D Shadow) */}
      <View style={styles.sketchHeroContainer}>
        <View
          style={[
            styles.diagonalSlash,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        />
        <View style={styles.portraitCutoutWrap}>
          <Image
            source={{ uri: salonInfo.ownerPortrait }}
            style={[styles.sketchPortraitImg, { opacity: isDarkMode ? 0.88 : 0.94 }]}
            resizeMode="cover"
          />
          <View
            style={[
              styles.portraitFadeLeft,
              {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(248,249,250,0.65)',
              },
            ]}
          />
          <View
            style={[
              styles.portraitFadeTop,
              {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(248,249,250,0.45)',
              },
            ]}
          />
          <View style={[styles.portraitFadeBottom, { backgroundColor: theme.bg }]} />
        </View>

        {/* Animated & Rotating Clean Flat Text Block */}
        <Animated.View
          style={[
            styles.sketchTextBlock,
            {
              opacity: Animated.multiply(fadeAnim, titleFadeAnim),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={handleBrandSecretTap}>
            <Text style={[styles.sketchMonuText, { color: theme.text }]}>{currentTitle.main}</Text>

            {/* Iconic G-Stack Row (Clean Flat Style) */}
            <View style={styles.sketchGentsRow}>
              <Text style={[styles.sketchGiantG, { color: theme.text }]}>{currentTitle.letter}</Text>
              <View style={styles.sketchEntsStack}>
                <Text style={[styles.sketchEntsText, { color: theme.text }]}>{currentTitle.rest}</Text>
                <View style={[styles.sketchUnderline, { backgroundColor: theme.text }]} />
              </View>
            </View>

            {/* Parlour Tagline */}
            <View style={styles.elegantSubRow}>
              <View style={[styles.subLineLeft, { backgroundColor: theme.subText }]} />
              <Text style={[styles.sketchParlourText, { color: theme.subText }]}>
                {currentTitle.parlour}
              </Text>
              <View style={[styles.subLineRight, { backgroundColor: theme.subText }]} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* 2-Chair Status Capsule with Soft Grey Borders */}
      <View
        style={[
          styles.chairsOuterCapsule,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor, borderWidth: 1 },
        ]}
      >
        <View style={styles.chairHalf}>
          <ChatIcon name="chair" size={28} color={theme.text} />
          <Text style={[styles.chairLabel, { color: theme.text }]}>CHAIR 1</Text>
          <View
            style={[
              styles.markCircle,
              { backgroundColor: chair1Booking ? theme.redSoft : theme.greenSoft },
            ]}
          >
            {chair1Booking ? (
              <Animated.View
                style={[styles.blinkingDot, { backgroundColor: theme.red, opacity: pulseAnim }]}
              />
            ) : (
              <ChatIcon name="check" size={18} color={theme.green} />
            )}
          </View>
          <Text
            style={[
              styles.chairStateSub,
              { color: chair1Booking ? theme.red : theme.green },
            ]}
          >
            {chair1Booking ? `Occupied (${chair1Booking.token})` : 'Vacant'}
          </Text>
        </View>

        <View style={[styles.verticalDivider, { backgroundColor: dynamicBorderColor }]} />

        <View style={styles.chairHalf}>
          <ChatIcon name="chair" size={28} color={theme.text} />
          <Text style={[styles.chairLabel, { color: theme.text }]}>CHAIR 2</Text>
          <View
            style={[
              styles.markCircle,
              { backgroundColor: chair2Booking ? theme.redSoft : theme.greenSoft },
            ]}
          >
            {chair2Booking ? (
              <Animated.View
                style={[styles.blinkingDot, { backgroundColor: theme.red, opacity: pulseAnim }]}
              />
            ) : (
              <ChatIcon name="check" size={18} color={theme.green} />
            )}
          </View>
          <Text
            style={[
              styles.chairStateSub,
              { color: chair2Booking ? theme.red : theme.green },
            ]}
          >
            {chair2Booking ? `Occupied (${chair2Booking.token})` : 'Vacant'}
          </Text>
        </View>
      </View>

      {/* Waiting Counter + Book Now Row */}
      <View style={styles.waitingBookRow}>
        <View style={styles.waitingBox}>
          <Text style={[styles.waitingLabel, { color: theme.subText }]}>waiting</Text>
          <Text style={[styles.waitingNumber, { color: theme.text }]}>{waitingQueue.length}</Text>
          <Text style={{ fontSize: 11, color: theme.muted, fontWeight: '700' }}>
            {estWaitMins === 0 ? '0 min wait' : `~${estWaitMins} mins`}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.bookNowPill,
            {
              backgroundColor: isOnline ? theme.primaryBtn : theme.subCard,
              borderWidth: isOnline ? 0 : 1,
              borderColor: dynamicBorderColor,
            },
          ]}
          onPress={() => {
            if (!isOnline) {
              Alert.alert(
                'Shop is Currently Closed',
                'Monu Gents Parlour is currently closed for online bookings. Please try again when the shop opens.'
              );
              return;
            }
            onOpenBooking();
          }}
        >
          <Text
            style={[
              styles.bookNowText,
              { color: isOnline ? theme.primaryBtnText : theme.muted },
            ]}
          >
            {isOnline ? 'Book now' : 'Shop Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 22, paddingBottom: 160, paddingTop: 10 },
  sketchHeroContainer: {
    height: 295,
    position: 'relative',
    marginTop: 2,
    marginBottom: 28,
    marginHorizontal: -22,
    paddingHorizontal: 24,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  diagonalSlash: {
    position: 'absolute',
    width: 340,
    height: 140,
    top: 75,
    left: -40,
    transform: [{ rotate: '-28deg' }],
    borderRadius: 40,
  },
  portraitCutoutWrap: {
    position: 'absolute',
    right: -6,
    bottom: 0,
    width: '64%',
    height: '88%',
    borderTopLeftRadius: 90,
    overflow: 'hidden',
  },
  sketchPortraitImg: { width: '100%', height: '100%' },
  portraitFadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%' },
  portraitFadeTop: { position: 'absolute', left: 0, right: 0, top: 0, height: 28 },
  portraitFadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: 28,
    opacity: 0.92,
  },
  sketchTextBlock: { zIndex: 5, paddingTop: 12, maxWidth: '68%' },
  sketchMonuText: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 46,
  },
  sketchGentsRow: { flexDirection: 'row', alignItems: 'center', marginTop: -6 },
  sketchGiantG: {
    fontSize: 68,
    fontWeight: '900',
    lineHeight: 70,
    marginRight: 2,
  },
  sketchEntsStack: { justifyContent: 'center', marginTop: 6 },
  sketchEntsText: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
    lineHeight: 36,
  },
  sketchUnderline: { height: 3, width: '100%', marginTop: 2, borderRadius: 2 },
  elegantSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginLeft: 4,
  },
  sketchParlourText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 5.5,
  },
  subLineLeft: { height: 1, width: 16, opacity: 0.7 },
  subLineRight: { height: 1, width: 24, opacity: 0.7 },
  chairsOuterCapsule: {
    borderRadius: 34,
    paddingVertical: 28,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  chairHalf: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: 100 },
  chairLabel: { fontSize: 16, fontWeight: '800', marginTop: 12, letterSpacing: 1.2 },
  markCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  blinkingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  chairStateSub: { fontSize: 12, marginTop: 8, fontWeight: '700' },
  waitingBookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  waitingBox: { alignItems: 'center', paddingHorizontal: 16 },
  waitingLabel: { fontSize: 19, fontWeight: '600' },
  waitingNumber: { fontSize: 42, fontWeight: '900', marginTop: 2 },
  bookNowPill: {
    flex: 1,
    marginLeft: 24,
    paddingVertical: 22,
    borderRadius: 99,
    alignItems: 'center',
  },
  bookNowText: { fontSize: 20, fontWeight: '900', letterSpacing: 0.3 },
});