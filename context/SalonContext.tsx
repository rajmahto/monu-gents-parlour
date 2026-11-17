// context/SalonContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  todayTotal: number;
  cashTotal: number;
  upiTotal: number;
  bookToken: (name: string, phone: string, service: ServiceItem) => boolean;
  cancelMyToken: (bookingId?: string) => void;
  addWalkIn: (name: string, phone: string) => void;
  seatCustomer: (bookingId: string, chairId: 1 | 2) => void;
  completeService: (booking: Booking, method: 'CASH' | 'UPI') => void;
  markNoShow: (bookingId: string) => void;
  submitReview: (rating: number, comment: string, photoUri?: string, bookingId?: string) => void;
  updateServicePrice: (id: string, delta: number) => void;
  addNewService: (name: string, price: number, duration: number) => void;
  addManualEarning: (desc: string, amount: number, method: 'CASH' | 'UPI') => void;
}

const STORAGE_KEY = '@monu_salon_v3_storage';

const SalonContext = createContext<SalonContextProps | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
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
    ownerPortrait:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
  });

  const [services, setServices] = useState<ServiceItem[]>([
    { id: 's1', name: 'Haircut', price: 40, duration: 15, desc: 'Sharp fade, classic cut & styling' },
    { id: 's2', name: 'Beard Trim / Shave', price: 30, duration: 10, desc: 'Razor line-up & beard set' },
    { id: 's3', name: 'Haircut + Beard Combo', price: 70, duration: 20, desc: 'Complete grooming package' },
    { id: 's4', name: 'Face Clean-up / Scrub', price: 100, duration: 15, desc: 'Instant glow face wash & scrub' },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'b1',
      token: '#Q-01',
      name: 'Ramesh Kumar',
      phone: '9876543210',
      serviceName: 'Haircut',
      price: 40,
      duration: 15,
      status: 'in_service',
      chairId: 1,
      time: '10:15 AM',
      type: 'walk_in',
    },
    {
      id: 'b2',
      token: '#Q-02',
      name: 'Amit Verma',
      phone: '9123456789',
      serviceName: 'Beard Trim / Shave',
      price: 30,
      duration: 10,
      status: 'waiting',
      time: '10:25 AM',
      type: 'online',
    },
  ]);

  const [earnings, setEarnings] = useState<EarningRecord[]>([
    {
      id: 'e1',
      desc: 'Haircut (#Q-00)',
      amount: 40,
      method: 'CASH',
      entryType: 'BOOKING',
      time: '09:45 AM',
      date: new Date().toISOString().split('T')[0],
    },
  ]);

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'r1',
      name: 'Sandeep K.',
      rating: 5,
      comment: 'Best fade in Azadnagar, zero waiting with token!',
      date: 'Yesterday',
    },
  ]);

  const [parlourPhotos, setParlourPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
  ]);

  // Supports MULTIPLE tokens booked from the same phone!
  const [myTokenIds, setMyTokenIds] = useState<string[]>(['b2']);

  const setMyTokenId = (id: string) => {
    if (!id) return;
    setMyTokenIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  };

  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
          if (parsed.isOnline !== undefined) setIsOnline(parsed.isOnline);
          if (parsed.isHindi !== undefined) setIsHindi(parsed.isHindi);
          if (parsed.ownerPassword) setOwnerPassword(parsed.ownerPassword);
          if (parsed.salonInfo) setSalonInfo(parsed.salonInfo);
          if (parsed.services) setServices(parsed.services);
          if (parsed.bookings) setBookings(parsed.bookings);
          if (parsed.earnings) setEarnings(parsed.earnings);
          if (parsed.reviews) setReviews(parsed.reviews);
          if (parsed.parlourPhotos) setParlourPhotos(parsed.parlourPhotos);
          if (Array.isArray(parsed.myTokenIds)) setMyTokenIds(parsed.myTokenIds);
        }
      } catch (err) {
        console.log('Storage load error:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isDarkMode,
            isOnline,
            isHindi,
            ownerPassword,
            salonInfo,
            services,
            bookings,
            earnings,
            reviews,
            parlourPhotos,
            myTokenIds,
          })
        );
      } catch (err) {
        console.log('Storage save error:', err);
      }
    };
    saveState();
  }, [
    isLoaded,
    isDarkMode,
    isOnline,
    isHindi,
    ownerPassword,
    salonInfo,
    services,
    bookings,
    earnings,
    reviews,
    parlourPhotos,
    myTokenIds,
  ]);

  const addParlourPhoto = (uri: string) => {
    setParlourPhotos((prev) => [uri, ...prev]);
  };

  const chair1Booking = bookings.find((b) => b.status === 'in_service' && b.chairId === 1) || null;
  const chair2Booking = bookings.find((b) => b.status === 'in_service' && b.chairId === 2) || null;
  const waitingQueue = bookings.filter((b) => b.status === 'waiting');

  // All active bookings for this phone (waiting, in_service, or unreviewed completed)
  const myActiveBookings = bookings.filter(
    (b) =>
      myTokenIds.includes(b.id) &&
      (b.status === 'waiting' ||
        b.status === 'in_service' ||
        (b.status === 'completed' && !b.reviewed))
  );

  const myTokenId = myTokenIds[0] || '';
  const myActiveBooking = myActiveBookings[0] || bookings.find((b) => b.id === myTokenId) || null;

  const bothChairsOccupied = Boolean(chair1Booking && chair2Booking);
  const estWaitMins =
    !bothChairsOccupied && waitingQueue.length === 0
      ? 0
      : Math.max(10, Math.round((waitingQueue.length * 12 + (bothChairsOccupied ? 10 : 0)) / 2));

  const todayTotal = earnings.reduce((s, e) => s + e.amount, 0);
  const cashTotal = earnings.filter((e) => e.method === 'CASH').reduce((s, e) => s + e.amount, 0);
  const upiTotal = earnings.filter((e) => e.method === 'UPI').reduce((s, e) => s + e.amount, 0);

  const bookToken = (name: string, phone: string, service: ServiceItem) => {
    if (!isOnline) {
      Alert.alert(
        'Shop is Currently Closed',
        'Monu Gents Parlour abhi online booking ke liye band hai. Dukan khulne par dobara try karein.'
      );
      return false;
    }
    if (name.trim().length < 2) {
      Alert.alert('Name Required', 'Kripya apna pura naam daalein (kam se kam 2 letters).');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      Alert.alert(
        'Invalid Mobile Number',
        'Kripya sahi 10-digit mobile number daalein (6, 7, 8 ya 9 se shuru hone wala).'
      );
      return false;
    }

    const nextNum = bookings.length + 1;
    const tokenStr = `#Q-${String(nextNum).padStart(2, '0')}`;
    const newBkg: Booking = {
      id: `b-${Date.now()}`,
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

    setBookings((prev) => [...prev, newBkg]);
    // Adds new token to the list without overwriting previous tokens on this phone!
    setMyTokenIds((prev) => [newBkg.id, ...prev]);
    return true;
  };

  const cancelMyToken = (bookingId?: string) => {
    const targetId = bookingId || myTokenId;
    if (!targetId) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === targetId ? { ...b, status: 'no_show', chairId: undefined } : b))
    );
    setMyTokenIds((prev) => prev.filter((id) => id !== targetId));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addWalkIn = (name: string, phone: string) => {
    if (name.trim().length < 2) return;
    const nextNum = bookings.length + 1;
    const tokenStr = `#Q-${String(nextNum).padStart(2, '0')}`;
    const srv = services[0];
    const newBkg: Booking = {
      id: `b-${Date.now()}`,
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
    setBookings((prev) => [...prev, newBkg]);
    setMyTokenIds((prev) => [newBkg.id, ...prev]);
    Alert.alert(
      isHindi ? 'टोकन बन गया' : 'Walk-In Token Created',
      isHindi
        ? `${name.trim()} का टोकन (${tokenStr}) कतार में जोड़ दिया गया है।`
        : `Token ${tokenStr} generated for ${name.trim()}.`
    );
  };

  const seatCustomer = (bookingId: string, chairId: 1 | 2) => {
    const occupiedBooking = bookings.find(
      (b) => b.status === 'in_service' && b.chairId === chairId
    );
    if (occupiedBooking) {
      Alert.alert(
        isHindi ? `कुर्सी ${chairId} पहले से भरी है!` : `Chair ${chairId} is Already Occupied!`,
        isHindi
          ? `कुर्सी ${chairId} पर अभी ${occupiedBooking.name} (${occupiedBooking.token}) बैठे हैं। पहले फ्लोर टैब में जाकर उनका काम पूरा (Complete) करें।`
          : `${occupiedBooking.name} (${occupiedBooking.token}) is currently seated on Chair ${chairId}. Please complete their service in the Floor tab first.`
      );
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'in_service', chairId } : b))
    );
    setMyTokenIds((prev) => (prev.includes(bookingId) ? prev : [bookingId, ...prev]));
    Alert.alert(
      isHindi ? `कुर्सी ${chairId} अलॉट हो गई` : `Seated on Chair ${chairId}`,
      isHindi
        ? `ग्राहक को कुर्सी ${chairId} पर बैठा दिया गया है।`
        : `Customer has been assigned to Chair ${chairId}.`
    );
  };

  const completeService = (booking: Booking, method: 'CASH' | 'UPI') => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, status: 'completed', chairId: undefined } : b
      )
    );

    setMyTokenIds((prev) => (prev.includes(booking.id) ? prev : [booking.id, ...prev]));

    const todayStr = new Date().toISOString().split('T')[0];

    setEarnings((prev) => [
      ...prev,
      {
        id: 'e_' + Date.now(),
        desc: `${booking.serviceName} (${booking.token} - ${booking.name})`,
        amount: booking.price,
        method,
        entryType: 'BOOKING',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: todayStr,
      },
    ]);
  };

  const markNoShow = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'no_show', chairId: undefined } : b))
    );
  };

  const submitReview = async (
    rating: number,
    comment: string,
    photoUri?: string,
    bookingId?: string
  ) => {
    const targetBooking =
      bookings.find((b) => b.id === bookingId) || myActiveBooking;
    const reviewerName = targetBooking?.name || 'Valued Customer';
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      bookingId: targetBooking?.id,
      name: reviewerName,
      rating,
      comment: comment.trim() || 'Great haircut & service!',
      photoUri,
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);
    if (targetBooking) {
      setBookings((prev) =>
        prev.map((b) => (b.id === targetBooking.id ? { ...b, reviewed: true } : b))
      );
    }
  };

  const updateServicePrice = (id: string, delta: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: Math.max(10, s.price + delta) } : s))
    );
  };

  const addNewService = (name: string, price: number, duration: number) => {
    if (!name.trim() || !price) return;
    const created: ServiceItem = {
      id: `s-${Date.now()}`,
      name: name.trim(),
      price,
      duration: duration || 15,
      desc: `Est. ${duration || 15} mins grooming service`,
    };
    setServices((prev) => [...prev, created]);
  };

  const addManualEarning = (desc: string, amount: number, method: 'CASH' | 'UPI') => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEarnings((prev) => [
      ...prev,
      {
        id: 'man_' + Date.now(),
        desc,
        amount,
        method,
        entryType: 'MANUAL',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: todayStr,
      },
    ]);
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
        setOwnerPassword,
        salonInfo,
        setSalonInfo,
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