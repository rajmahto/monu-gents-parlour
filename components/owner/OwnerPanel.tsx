// // app/owner.tsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useSalon } from '../context/SalonContext';
// import { getTheme } from '../constants/theme';
// import { OwnerTabType } from '../components/owner/OwnerBottomNav';
// import { OwnerBottomNav } from '../components/owner/OwnerBottomNav';
// import { ChatIcon } from '../components/common/ChatIcon';

// // Import individual owner pages with correct relative paths for app/ directory
// import { OwnerFloorPage } from '../components/owner/floor';
// import { OwnerRatesPage } from '../components/owner/rates';
// import { OwnerEarningsPage } from '../components/owner/earnings';
// import { OwnerSettingsPage } from '../components/owner/settings';
// import { OwnerQueuePage } from '../components/owner/queue';

// export default function OwnerScreen() {
//   const { isDarkMode } = useSalon();
//   const theme = getTheme(isDarkMode);

//   const [ownerAuthenticated, setOwnerAuthenticated] = useState(false);
//   const [ownerPass, setOwnerPass] = useState('');
//   const [activeTab, setActiveTab] = useState<OwnerTabType>('floor');

//   if (!ownerAuthenticated) {
//     return (
//       <View style={[styles.loginBox, { backgroundColor: theme.bg }]}>
//         <View style={[styles.ownerCard, { backgroundColor: theme.card, padding: 26 }]}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
//             <ChatIcon name="shield" size={24} color={theme.text} />
//             <Text style={[styles.loginTitle, { color: theme.text }]}>Owner Admin Access</Text>
//           </View>
//           <Text style={[styles.loginSub, { color: theme.subText }]}>
//             Enter secure password to access management portal
//           </Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: theme.subCard, color: theme.text }]}
//             placeholder="Enter password..."
//             placeholderTextColor={theme.muted}
//             secureTextEntry={true}
//             value={ownerPass}
//             onChangeText={setOwnerPass}
//           />
//           <TouchableOpacity
//             style={[styles.whiteBtn, { backgroundColor: theme.primaryBtn }]}
//             onPress={() => {
//               if (ownerPass === 'monu123' || ownerPass === '1234') {
//                 setOwnerAuthenticated(true);
//                 setOwnerPass('');
//               } else {
//                 Alert.alert('Access Denied', 'Incorrect password entered. Please try again.');
//               }
//             }}
//           >
//             <Text style={[styles.whiteBtnText, { color: theme.primaryBtnText }]}>
//               Unlock Admin Portal
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.bg }}>
//       {/* Active Page View */}
//       <View style={{ flex: 1 }}>
//         {activeTab === 'floor' && <OwnerFloorPage />}
//         {activeTab === 'queue' && <OwnerQueuePage />}
//         {activeTab === 'earnings' && <OwnerEarningsPage />}
//         {activeTab === 'settings' && <OwnerSettingsPage />}
//       </View>

//       {/* Owner Bottom Navigation Bar */}
//       <OwnerBottomNav activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   ownerCard: { padding: 20, borderRadius: 28, marginBottom: 16, width: '100%', maxWidth: 400, alignSelf: 'center' },
//   loginBox: { flex: 1, justifyContent: 'center', padding: 24, alignItems: 'center' },
//   loginTitle: { fontSize: 22, fontWeight: '900' },
//   loginSub: { fontSize: 13, marginBottom: 20 },
//   input: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 18,
//     fontSize: 14,
//     marginBottom: 14,
//   },
//   whiteBtn: { paddingVertical: 16, borderRadius: 99, alignItems: 'center', marginBottom: 0 },
//   whiteBtnText: { fontSize: 15, fontWeight: '900' },
// });