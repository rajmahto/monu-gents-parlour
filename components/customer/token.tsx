// components/customer/token.tsx
import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Animated,
  Alert,
} from 'react-native';
import { useSalon } from '../../context/SalonContext';
import { getTheme } from '../../constants/theme';
import { ChatIcon } from '../../components/common/ChatIcon';

export const CustomerTokenPage = () => {
  const {
    isDarkMode,
    myActiveBookings,
    cancelMyToken,
    submitReview,
    salonInfo,
    bookings,
  } = useSalon() as any;

  const theme = getTheme(isDarkMode);
  const dynamicBorderColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const [ratingsMap, setRatingsMap] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, string>>({});

  const showCustomToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  };

  const googleMapsUrl =
    salonInfo?.mapUrl ||
    'https://www.google.com/maps/search/?api=1&query=Monu+Gents+Parlour+Azadnagar+Gomoh+Dhanbad';

  const handleReviewAndOpenGoogle = (bookingId: string) => {
    const rating = ratingsMap[bookingId] ?? 5;
    const comment = commentsMap[bookingId] ?? '';

    submitReview(rating, comment, undefined, bookingId);
    showCustomToast('Rating saved! Opening Google Maps...');

    setTimeout(() => {
      Linking.openURL(googleMapsUrl).catch(() => {
        Alert.alert('Notice', 'Could not open Google Maps.');
      });
    }, 400);
  };

  const completedHistory = bookings.filter((b: any) => b.status === 'completed');

  return (
    <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Active Passes ({myActiveBookings?.length || 0})
        </Text>
        <Text style={[styles.pageSub, { color: theme.subText }]}>
          Live queue tracking & session history
        </Text>
      </View>

      {!myActiveBookings || myActiveBookings.length === 0 ? (
        <View
          style={[
            styles.ticketCard,
            { backgroundColor: theme.card, borderColor: dynamicBorderColor, alignItems: 'center', paddingVertical: 48 },
          ]}
        >
          <ChatIcon name="scissors" size={24} color={theme.muted} />
          <Text style={[styles.emptyTitle, { color: theme.text, marginTop: 14 }]}>
            No Active Tokens
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
            Visit Home or Service tab to secure your spot.
          </Text>
        </View>
      ) : (
        myActiveBookings.map((item: any) => {
          const isCompleted = item.status === 'completed';
          const isInService = item.status === 'in_service';
          const selectedStars = ratingsMap[item.id] ?? 5;
          const commentText = commentsMap[item.id] ?? '';

          return (
            <View key={item.id} style={{ marginBottom: 20 }}>
              <View
                style={[
                  styles.ticketCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: isCompleted ? '#10B981' : dynamicBorderColor,
                    borderWidth: isCompleted ? 1.5 : 1,
                  },
                ]}
              >
                <View style={styles.ticketHeader}>
                  <Text style={[styles.salonBrandTag, { color: theme.muted }]}>
                    {item.name.toUpperCase()} • {item.time}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          isCompleted || isInService
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        borderColor: isCompleted || isInService ? '#10B981' : '#F59E0B',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '900',
                        color: isCompleted || isInService ? '#10B981' : '#F59E0B',
                        letterSpacing: 0.8,
                      }}
                    >
                      {item.status === 'waiting' && 'IN QUEUE'}
                      {isInService && `ON CHAIR 0${item.chairId}`}
                      {isCompleted && 'COMPLETED'}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'center', paddingVertical: 14 }}>
                  <Text style={[styles.tokenBigNumber, { color: theme.text }]}>
                    {item.token}
                  </Text>
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '800',
                      marginTop: 2,
                    }}
                  >
                    {item.serviceName} • ₹{item.price}
                  </Text>
                  <Text
                    style={{
                      color: theme.subText,
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: '600',
                    }}
                  >
                    {isCompleted
                      ? 'Grooming completed successfully'
                      : isInService
                      ? `Seated on Chair ${item.chairId}`
                      : `Estimated wait: ~${item.duration} mins`}
                  </Text>

                  {item.status === 'waiting' && (
                    <View style={styles.ticketActionsRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.actionBtnOutline,
                          { borderColor: dynamicBorderColor, backgroundColor: theme.subCard },
                        ]}
                        onPress={() => Linking.openURL(`tel:${salonInfo.phone || '8252870053'}`)}
                      >
                        <ChatIcon name="phone" size={12} color={theme.text} />
                        <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800' }}>
                          Call
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.actionBtnOutline,
                          {
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          },
                        ]}
                        onPress={() => {
                          Alert.alert(
                            'Cancel Token?',
                            `Remove token ${item.token} from queue?`,
                            [
                              { text: 'Keep', style: 'cancel' },
                              {
                                text: 'Cancel',
                                style: 'destructive',
                                onPress: () => {
                                  cancelMyToken(item.id);
                                  showCustomToast(`Token ${item.token} cancelled.`);
                                },
                              },
                            ]
                          );
                        }}
                      >
                        <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Refined Minimal Luxury Review Box */}
                {isCompleted && !item.reviewed && (
                  <View
                    style={[
                      styles.reviewInnerSection,
                      { borderTopColor: dynamicBorderColor },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '900',
                        color: '#10B981',
                        letterSpacing: 1.2,
                        textAlign: 'center',
                      }}
                    >
                      RATE YOUR EXPERIENCE
                    </Text>

                    <View style={styles.classyStarRow}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= selectedStars;
                        return (
                          <TouchableOpacity
                            key={star}
                            activeOpacity={0.75}
                            onPress={() =>
                              setRatingsMap((prev) => ({ ...prev, [item.id]: star }))
                            }
                            style={[
                              styles.classyStarBox,
                              {
                                backgroundColor: active
                                  ? 'rgba(16, 185, 129, 0.12)'
                                  : theme.subCard,
                                borderColor: active ? '#10B981' : dynamicBorderColor,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                color: active ? '#10B981' : theme.muted,
                              }}
                            >
                              ★
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '800',
                                color: active ? '#10B981' : theme.muted,
                                marginTop: 1,
                              }}
                            >
                              {star}.0
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <TextInput
                      style={[
                        styles.reviewInput,
                        {
                          backgroundColor: theme.subCard,
                          color: theme.text,
                          borderColor: dynamicBorderColor,
                        },
                      ]}
                      placeholder="Write feedback (optional)..."
                      placeholderTextColor={theme.muted}
                      value={commentText}
                      onChangeText={(txt) =>
                        setCommentsMap((prev) => ({ ...prev, [item.id]: txt }))
                      }
                    />

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.googleSubmitBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => handleReviewAndOpenGoogle(item.id)}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>
                        Submit & Rate on Google Maps
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}

      {/* Visit History Section */}
      <View
        style={[
          styles.ticketCard,
          { backgroundColor: theme.card, borderColor: dynamicBorderColor, marginTop: 4 },
        ]}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 14,
            fontWeight: '900',
            marginBottom: 10,
          }}
        >
          Recent Visit History
        </Text>
        {completedHistory.length === 0 ? (
          <Text style={{ color: theme.subText, fontSize: 12, fontWeight: '600' }}>
            Completed services will appear here.
          </Text>
        ) : (
          completedHistory.map((item: any) => (
            <View
              key={item.id}
              style={[styles.historyRow, { borderBottomColor: dynamicBorderColor }]}
            >
              <View>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13 }}>
                  {item.serviceName} ({item.name})
                </Text>
                <Text style={{ color: theme.subText, fontSize: 11, marginTop: 2 }}>
                  Token {item.token} • {item.time}
                </Text>
              </View>
              <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 13 }}>
                ₹{item.price}
              </Text>
            </View>
          ))
        )}
      </View>

      {toastMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastAnim,
              backgroundColor: isDarkMode ? '#18181B' : '#FFFFFF',
              borderColor: dynamicBorderColor,
            },
          ]}
        >
          <Text style={[styles.toastText, { color: theme.text }]}>{toastMessage}</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollPad: { paddingHorizontal: 20, paddingBottom: 180, paddingTop: 14 },
  headerRow: { marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 0.3 },
  pageSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  ticketCard: { padding: 20, borderRadius: 26, borderWidth: 1 },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  salonBrandTag: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, borderWidth: 1 },
  tokenBigNumber: { fontSize: 52, fontWeight: '900', marginVertical: 2, letterSpacing: 1 },
  ticketActionsRow: { flexDirection: 'row', gap: 10, marginTop: 14, width: '100%' },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 15, fontWeight: '900', marginBottom: 2 },
  emptySubtitle: { fontSize: 12, textAlign: 'center', fontWeight: '600' },
  reviewInnerSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  classyStarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 14,
  },
  classyStarBox: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInput: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    fontSize: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  googleSubmitBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  toastContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
    zIndex: 999,
  },
  toastText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
});