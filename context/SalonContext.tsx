// context/SalonContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ServiceItem, Booking, ReviewItem, EarningRecord } from '../types/database';

interface SalonInfo {
  name: string;
  phone: string;
  address: string;
  hours: string;
  closingDay: string;
  instaId: string;
  youtubeChannel: string;
  mapUrl: string;
  instaUrl?: string;
  youtubeUrl?: string;
  ownerPortrait: string;
}

interface SalonContextProps {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
  isHindi: boolean;
  setIsHindi: (v: boolean) => void;
  ownerPassword: string;
  setOwnerPassword: (v: string) => void;
  salonInfo: SalonInfo;
  setSalonInfo: React.Dispatch<React.SetStateAction<SalonInfo>>;
  updateSalonSettings: (newInfo: Partial<SalonInfo>) => Promise<void>;
  services: ServiceItem[];
  deleteService: (id: string) => void;
  bookings: Booking[];
  earnings: EarningRecord[];
  reviews: ReviewItem[];
  parlourPhotos: string[];
  addParlourPhoto: (uri: string) => void;
  myTokenId: string;
  setMyTokenId: (id: string) => void;
  myTokenIds: string[];
  myActiveBookings: Booking[];
  chair1Booking: Booking | null;
  chair2Booking: Booking | null;
  waitingQueue: Booking[];
  myActiveBooking: Booking | null;
  estWaitMins: number;
  getEstimatedWaitForBooking: (bookingId: string) => number;
  todayTotal: number;
  cashTotal: number;
  upiTotal: number;
  bookToken: (name: string, phone: string, service: ServiceItem) => boolean;
  cancelMyToken: (bookingId?: string) => void;
  addWalkIn: (name: string, phone: string) => void;
  seatCustomer: (bookingId: string, chairId: 1 | 2) => void;
  completeService: (booking: Booking, method: 'CASH' | 'UPI', chairId?: 1 | 2) => void;
  markNoShow: (bookingId: string) => void;
  submitReview: (rating: number, comment: string, photoUri?: string, bookingId?: string) => void;
  updateServicePrice: (id: string, delta: number) => void;
  addNewService: (name: string, price: number, duration: number) => void;
  addManualEarning: (desc: string, amount: number, method: 'CASH' | 'UPI') => void;
}

const SalonContext = createContext<SalonContextProps | undefined>(undefined);

// Monu Bhaiya's Google Drive Direct Image Link
const DEFAULT_PORTRAIT = 'https://lh3.googleusercontent.com/d/1KPFRTVNJPTA5RY1DjpQWn0DJY1E6zDTd';

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOnline, setIsOnlineState] = useState(true);
  const [isHindi, setIsHindi] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('monu123');

  const [salonInfo, setSalonInfo] = useState<SalonInfo>({
    name: 'MONU GENTS PARLOUR',
    phone: '8252870053',
    address: 'Azadnagar, Gomoh, Dhanbad, Jharkhand',
    hours: '08:00 AM - 09:00 PM',
    closingDay: 'Open All Days',
    instaId: '@monu_gents_parlour',
    youtubeChannel: 'Monu Parlour Vlogs',
    mapUrl: 'https://goo.gl/maps/e4ekJQoSkE2xMWXB8',
    instaUrl: 'https://instagram.com/monu_gents_parlour',
    youtubeUrl: 'https://youtube.com/@MonuParlourVlogs',
    ownerPortrait: DEFAULT_PORTRAIT,
  });

  const [services, setServices] = useState<ServiceItem[]>([
    { id: 's1', name: 'Haircut', price: 40, duration: 15, desc: 'Sharp fade, classic cut & styling' },
    { id: 's2', name: 'Beard Trim / Shave', price: 30, duration: 10, desc: 'Razor line-up & beard set' },
    { id: 's3', name: 'Haircut + Beard Combo', price: 70, duration: 20, desc: 'Complete grooming package' },
    { id: 's4', name: 'Face Clean-up / Scrub', price: 100, duration: 15, desc: 'Instant glow face wash & scrub' },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [parlourPhotos, setParlourPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
  ]);

  const [myTokenIds, setMyTokenIds] = useState<string[]>([]);

  const setMyTokenId = (id: string) => {
    if (!id) return;
    setMyTokenIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  };

  const setIsOnline = async (status: boolean) => {
    setIsOnlineState(status);
    try {
      await setDoc(
        doc(db, 'settings', 'salonData'),
        {
          isOnline: status,
        },
        { merge: true }
      );
    } catch (err) {
      console.log('Shop status sync error:', err);
    }
  };

  useEffect(() => {
    try {
      const unsubSettings = onSnapshot(doc(db, 'settings', 'salonData'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.parlourPhotos && Array.isArray(data.parlourPhotos)) {
            setParlourPhotos(data.parlourPhotos);
          }
          if (data.salonInfo) {
            setSalonInfo((prev) => ({
              ...prev,
              ...data.salonInfo,
              ownerPortrait: DEFAULT_PORTRAIT,
            }));
          }
          if (data.ownerPassword) {
            setOwnerPassword(data.ownerPassword);
          }
          if (typeof data.isOnline === 'boolean') {
            setIsOnlineState(data.isOnline);
          }
        }
      });

      const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const fetchedBookings: Booking[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as Booking),
          id: docSnap.id,
        }));
        setBookings(fetchedBookings);
        setIsLoaded(true);
      });

      const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
        const fetchedServices: ServiceItem[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as ServiceItem),
          id: docSnap.id,
        }));
        if (fetchedServices.length > 0) {
          setServices(fetchedServices);
        }
      });

      const unsubEarnings = onSnapshot(collection(db, 'earnings'), (snapshot) => {
        const fetchedEarnings: EarningRecord[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as EarningRecord),
          id: docSnap.id,
        }));
        setEarnings(fetchedEarnings);
      });

      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        const fetchedReviews: ReviewItem[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as ReviewItem),
          id: docSnap.id,
        }));
        setReviews(fetchedReviews);
      });

      return () => {
        unsubSettings();
        unsubBookings();
        unsubServices();
        unsubEarnings();
        unsubReviews();
      };
    } catch (err) {
      console.log('Firebase sync error:', err);
      setIsLoaded(true);
    }
  }, []);

  const updateSalonSettings = async (newInfo: Partial<SalonInfo>) => {
    try {
      const updated = {
        ...salonInfo,
        ...newInfo,
        ownerPortrait: DEFAULT_PORTRAIT,
      };

      setSalonInfo(updated);
      await setDoc(
        doc(db, 'settings', 'salonData'),
        {
          salonInfo: updated,
        },
        { merge: true }
      );
    } catch (err) {
      console.log('Salon settings save error:', err);
    }
  };

  const updateOwnerPasswordSecure = async (newPass: string) => {
    try {
      setOwnerPassword(newPass);
      await setDoc(
        doc(db, 'settings', 'salonData'),
        {
          ownerPassword: newPass,
        },
        { merge: true }
      );
    } catch (err) {
      console.log('Password save error:', err);
    }
  };

  const addParlourPhoto = async (uri: string) => {
    try {
      const updatedPhotos = [uri, ...parlourPhotos];
      setParlourPhotos(updatedPhotos);
      await setDoc(
        doc(db, 'settings', 'salonData'),
        {
          parlourPhotos: updatedPhotos,
        },
        { merge: true }
      );
    } catch (err) {
      console.log('Photo save error:', err);
    }
  };

  const chair1Booking = bookings.find((b) => b.status === 'in_service' && b.chairId === 1) || null;
  const chair2Booking = bookings.find((b) => b.status === 'in_service' && b.chairId === 2) || null;
  const waitingQueue = bookings.filter((b) => b.status === 'waiting');

  const myActiveBookings = bookings.filter(
    (b) =>
      myTokenIds.includes(b.id) &&
      (b.status === 'waiting' ||
        b.status === 'in_service' ||
        (b.status === 'completed' && !b.reviewed))
  );

  const myTokenId = myTokenIds[0] || '';
  const myActiveBooking = myActiveBookings[0] || bookings.find((b) => b.id === myTokenId) || null;

  // Smart 2-chair capacity based wait time helper for any specific waiting booking
  const getEstimatedWaitForBooking = (bookingId: string): number => {
    const queueIndex = waitingQueue.findIndex((b) => b.id === bookingId);
    if (queueIndex === -1) return 0;

    const occupiedChairsCount = (chair1Booking ? 1 : 0) + (chair2Booking ? 1 : 0);
    const activeChairAvgMins =
      occupiedChairsCount === 2
        ? Math.round(
            ((chair1Booking?.duration || 12) + (chair2Booking?.duration || 12)) / 2
          )
        : occupiedChairsCount === 1
        ? chair1Booking?.duration || chair2Booking?.duration || 12
        : 0;

    const aheadBookings = waitingQueue.slice(0, queueIndex);
    const aheadDurationSum = aheadBookings.reduce((sum, item) => sum + (item.duration || 12), 0);

    // If at least one chair is free and nobody is ahead in queue, wait is ~0-5 mins
    if (queueIndex === 0 && occupiedChairsCount < 2) {
      return 0;
    }

    // 2 chairs work in parallel, so total load distributes across active chairs (min 2 for full shop)
    const parallelDivisor = occupiedChairsCount === 2 ? 2 : 1;
    const rawMins = (aheadDurationSum + (occupiedChairsCount === 2 ? activeChairAvgMins : 0)) / parallelDivisor;

    return Math.max(5, Math.round(rawMins / 5) * 5);
  };

  // Overall shop estimated wait for a new incoming customer
  const bothChairsOccupied = Boolean(chair1Booking && chair2Booking);
  const queueTotalMins = waitingQueue.reduce((sum, item) => sum + (item.duration || 12), 0);
  const estWaitMins =
    waitingQueue.length === 0 && !bothChairsOccupied
      ? 0
      : Math.max(
          5,
          Math.round(((queueTotalMins + (bothChairsOccupied ? 10 : 0)) / 2) / 5) * 5
        );

  const todayTotal = earnings.reduce((s, e) => s + e.amount, 0);
  const cashTotal = earnings.filter((e) => e.method === 'CASH').reduce((s, e) => s + e.amount, 0);
  const upiTotal = earnings.filter((e) => e.method === 'UPI').reduce((s, e) => s + e.amount, 0);

  const bookToken = (name: string, phone: string, service: ServiceItem) => {
    if (!isOnline) {
      const msg = isHindi
        ? 'दुकान अभी बुकिंग के लिए बंद है।'
        : 'Monu Gents Parlour is currently closed for bookings.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Shop Closed', msg);
      return false;
    }
    if (name.trim().length < 2) {
      const msg = isHindi ? 'कृपया अपना सही नाम दर्ज करें।' : 'Please enter your full name.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Name Required', msg);
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      const msg = isHindi
        ? 'कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।'
        : 'Please enter a valid 10-digit mobile number.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Invalid Mobile Number', msg);
      return false;
    }

    const todayBookingsCount =
      bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'no_show').length + 1;
    const tokenStr = `#Q-${String(todayBookingsCount).padStart(2, '0')}`;
    const customId = `b-${Date.now()}`;
    const newBkg: Booking = {
      id: customId,
      token: tokenStr,
      name: name.trim(),
      phone: phone.trim(),
      serviceName: service.name,
      price: service.price,
      duration: service.duration,
      status: 'waiting',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'online',
    };

    setDoc(doc(db, 'bookings', customId), newBkg).catch((err) => console.log('Booking error:', err));
    setMyTokenIds((prev) => [newBkg.id, ...prev]);

    const successMsg = isHindi
      ? `टोकन ${tokenStr} सफलतापूर्वक बुक हो गया!`
      : `Token ${tokenStr} booked successfully!`;
    if (Platform.OS === 'web') window.alert(successMsg);
    else Alert.alert('Success', successMsg);

    return true;
  };

  const cancelMyToken = (bookingId?: string) => {
    const targetId = bookingId || myTokenId;
    if (!targetId) return;

    setMyTokenIds((prev) => prev.filter((id) => id !== targetId));
    setBookings((prev) => prev.filter((b) => b.id !== targetId));

    deleteDoc(doc(db, 'bookings', targetId))
      .then(() => {
        const msg = isHindi
          ? 'टोकन सफलतापूर्वक रद्द और हटा दिया गया है।'
          : 'Token successfully cancelled and removed.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Cancelled', msg);
      })
      .catch((err) => {
        console.log('Cancel delete error:', err);
      });
  };

  const deleteService = (id: string) => {
    deleteDoc(doc(db, 'services', id)).catch((err) => console.log('Delete service error:', err));
  };

  const addWalkIn = (name: string, phone: string) => {
    if (name.trim().length < 2) return;
    const todayBookingsCount =
      bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'no_show').length + 1;
    const tokenStr = `#Q-${String(todayBookingsCount).padStart(2, '0')}`;
    const srv = services[0] || { name: 'Haircut', price: 40, duration: 15 };
    const customId = `b-${Date.now()}`;
    const newBkg: Booking = {
      id: customId,
      token: tokenStr,
      name: name.trim(),
      phone: phone.trim() || '8252870053',
      serviceName: srv.name,
      price: srv.price,
      duration: srv.duration,
      status: 'waiting',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'walk_in',
    };

    setDoc(doc(db, 'bookings', customId), newBkg).catch((err) => console.log('Walk-in error:', err));
    setMyTokenIds((prev) => [newBkg.id, ...prev]);
  };

  const seatCustomer = (bookingId: string, chairId: 1 | 2) => {
    const occupiedBooking = bookings.find(
      (b) => b.status === 'in_service' && b.chairId === chairId
    );
    if (occupiedBooking) {
      const msg = isHindi
        ? `कुर्सी ${chairId} पर अभी ${occupiedBooking.name} (${occupiedBooking.token}) बैठे हैं। पहले उनका काम पूरा करें।`
        : `Chair ${chairId} is currently occupied by ${occupiedBooking.name} (${occupiedBooking.token}). Please complete their service first.`;

      if (Platform.OS === 'web') window.alert(msg);
      else
        Alert.alert(
          isHindi ? `कुर्सी ${chairId} खाली नहीं है!` : `Chair ${chairId} Occupied!`,
          msg
        );
      return;
    }

    updateDoc(doc(db, 'bookings', bookingId), {
      status: 'in_service',
      chairId,
    }).catch((err) => console.log('Seat error:', err));

    setMyTokenIds((prev) => (prev.includes(bookingId) ? prev : [bookingId, ...prev]));

    const successMsg = isHindi
      ? `ग्राहक को कुर्सी ${chairId} पर बैठा दिया गया है।`
      : `Customer successfully seated on Chair ${chairId}.`;
    if (Platform.OS === 'web') window.alert(successMsg);
    else Alert.alert('Seated', successMsg);
  };

  const completeService = (booking: Booking, method: 'CASH' | 'UPI', chairId?: 1 | 2) => {
    const assignedChair = chairId || booking.chairId || 1;

    updateDoc(doc(db, 'bookings', booking.id), {
      status: 'completed',
      chairId: null,
    }).catch((err) => console.log('Complete booking error:', err));

    setMyTokenIds((prev) => (prev.includes(booking.id) ? prev : [booking.id, ...prev]));

    const todayStr = new Date().toISOString().split('T')[0];
    const earningId = 'e_' + Date.now();
    const newEarning: EarningRecord = {
      id: earningId,
      desc: `${booking.serviceName} (${booking.token} - ${booking.name})`,
      amount: booking.price,
      method,
      entryType: 'BOOKING',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: todayStr,
      chairId: assignedChair,
    };

    setDoc(doc(db, 'earnings', earningId), newEarning).catch((err) =>
      console.log('Earning save error:', err)
    );
  };

  const markNoShow = (bookingId: string) => {
    updateDoc(doc(db, 'bookings', bookingId), {
      status: 'no_show',
      chairId: null,
    }).catch((err) => console.log('No show error:', err));
  };

  const submitReview = async (
    rating: number,
    comment: string,
    photoUri?: string,
    bookingId?: string
  ) => {
    const targetBooking = bookings.find((b) => b.id === bookingId) || myActiveBooking;
    const reviewerName = targetBooking?.name || 'Valued Customer';
    const revId = `rev-${Date.now()}`;
    const newRev: ReviewItem = {
      id: revId,
      bookingId: targetBooking?.id,
      name: reviewerName,
      rating,
      comment: comment.trim() || 'Great haircut & service!',
      photoUri,
      date: 'Just now',
    };

    setDoc(doc(db, 'reviews', revId), newRev).catch((err) => console.log('Review error:', err));

    if (targetBooking) {
      updateDoc(doc(db, 'bookings', targetBooking.id), {
        reviewed: true,
      }).catch((err) => console.log('Review flag error:', err));

      setMyTokenIds((prev) => prev.filter((id) => id !== targetBooking.id));
    }
  };

  const updateServicePrice = (id: string, delta: number) => {
    const srv = services.find((s) => s.id === id);
    if (!srv) return;
    const newPrice = Math.max(10, srv.price + delta);

    updateDoc(doc(db, 'services', id), {
      price: newPrice,
    }).catch((err) => console.log('Update price error:', err));
  };

  const addNewService = (name: string, price: number, duration: number) => {
    if (!name.trim() || !price) return;
    const sId = `s-${Date.now()}`;
    const created: ServiceItem = {
      id: sId,
      name: name.trim(),
      price,
      duration: duration || 15,
      desc: `Est. ${duration || 15} mins grooming service`,
    };

    setDoc(doc(db, 'services', sId), created).catch((err) =>
      console.log('Add service error:', err)
    );
  };

  const addManualEarning = (desc: string, amount: number, method: 'CASH' | 'UPI') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const earningId = 'man_' + Date.now();
    const newEarning: EarningRecord = {
      id: earningId,
      desc,
      amount,
      method,
      entryType: 'MANUAL',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: todayStr,
      chairId: 1,
    };

    setDoc(doc(db, 'earnings', earningId), newEarning).catch((err) =>
      console.log('Manual earning error:', err)
    );
  };

  return (
    <SalonContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        isOnline,
        setIsOnline,
        isHindi,
        setIsHindi,
        ownerPassword,
        setOwnerPassword: updateOwnerPasswordSecure,
        salonInfo,
        setSalonInfo,
        updateSalonSettings,
        services,
        deleteService,
        bookings,
        earnings,
        reviews,
        parlourPhotos,
        addParlourPhoto,
        myTokenId,
        setMyTokenId,
        myTokenIds,
        myActiveBookings,
        chair1Booking,
        chair2Booking,
        waitingQueue,
        myActiveBooking,
        estWaitMins,
        getEstimatedWaitForBooking,
        todayTotal,
        cashTotal,
        upiTotal,
        bookToken,
        cancelMyToken,
        addWalkIn,
        seatCustomer,
        completeService,
        markNoShow,
        submitReview,
        updateServicePrice,
        addNewService,
        addManualEarning,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon must be used inside SalonProvider');
  return ctx;
};