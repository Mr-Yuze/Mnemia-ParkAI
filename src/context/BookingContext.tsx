import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  ParkingLocation,
  ParkingSlot,
  Booking,
  PaymentRecord,
  NotificationItem,
  DashboardStats,
  SlotType,
} from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface BookingContextType {
  locations: ParkingLocation[];
  slots: ParkingSlot[];
  bookings: Booking[];
  userBookings: Booking[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  stats: DashboardStats;
  loading: boolean;
  refreshData: () => Promise<void>;
  calculateFee: (
    location: ParkingLocation,
    slotType: SlotType,
    durationHours: number
  ) => { baseFee: number; surcharge: number; tax: number; totalFee: number };
  createBooking: (
    data: Omit<Booking, 'bookingId' | 'createdAt'>
  ) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  verifyEntry: (reference: string) => Promise<{ success: boolean; message: string; booking?: Booking }>;
  verifyExit: (reference: string) => Promise<{ success: boolean; message: string; booking?: Booking }>;
  saveLocation: (location: ParkingLocation) => Promise<void>;
  deleteLocation: (locationId: string) => Promise<void>;
  saveSlot: (slot: ParkingSlot) => Promise<void>;
  deleteSlot: (slotId: string) => Promise<void>;
  updateSlotStatus: (slotId: string, status: ParkingSlot['operationalStatus']) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    reservedSlots: 0,
    activeBookings: 0,
    todayRevenue: 0,
    totalBookings: 0,
    vehiclesEnteredToday: 0,
    vehiclesExitedToday: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      const [allLocs, allSlots, allBks, allPmts, allStats] = await Promise.all([
        StorageService.getLocations(),
        StorageService.getSlots(),
        StorageService.getBookings(),
        StorageService.getPayments(),
        StorageService.getDashboardStats(),
      ]);

      setLocations(allLocs);
      setSlots(allSlots);
      setBookings(allBks);
      setPayments(allPmts);
      setStats(allStats);

      if (user) {
        const notifs = await StorageService.getNotifications(user.uid);
        setNotifications(notifs);
      }
    } catch (err) {
      console.error('Failed to load storage data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to real-time events
  useEffect(() => {
    refreshData();

    const unsubLocs = StorageService.subscribe('locations', () => refreshData());
    const unsubSlots = StorageService.subscribe('slots', () => refreshData());
    const unsubBks = StorageService.subscribe('bookings', () => refreshData());
    const unsubPmts = StorageService.subscribe('payments', () => refreshData());
    const unsubNotifs = StorageService.subscribe('notifications', () => refreshData());

    return () => {
      unsubLocs();
      unsubSlots();
      unsubBks();
      unsubPmts();
      unsubNotifs();
    };
  }, [refreshData]);

  const userBookings = user
    ? bookings.filter((b) => b.userId === user.uid)
    : [];

  const unreadNotifsCount = notifications.filter((n) => !n.readStatus).length;

  const calculateFee = (
    location: ParkingLocation,
    slotType: SlotType,
    durationHours: number
  ) => {
    const hours = Math.max(1, durationHours);
    const hourlyBase = location.pricingRules?.hourlyRate || location.hourlyRate || 40;
    const baseFee = hourlyBase * hours;

    let surcharge = 0;
    if (slotType === 'EV') {
      surcharge = (location.pricingRules?.evSurcharge || 20) * hours;
    } else if (slotType === 'VIP') {
      surcharge = 15 * hours;
    }

    const subtotal = baseFee + surcharge;
    const tax = Math.round(subtotal * 0.05); // 5% GST/Service tax
    const totalFee = subtotal + tax;

    return { baseFee, surcharge, tax, totalFee };
  };

  const createBooking = async (data: Omit<Booking, 'bookingId' | 'createdAt'>) => {
    const res = await StorageService.createBooking(data);
    if (res.success && res.booking) {
      // Record payment
      await StorageService.recordPayment({
        bookingId: res.booking.bookingId,
        userId: res.booking.userId,
        amount: res.booking.totalAmount,
        paymentMethod: res.booking.paymentMethod || 'UPI',
        paymentStatus: 'success',
        transactionReference: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        gatewayProvider: 'Mnemia Secure Digital Gateway',
      });
      await refreshData();
    }
    return res;
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    const res = await StorageService.cancelBooking(bookingId, reason);
    if (res.success) {
      toast.success(res.message);
      await refreshData();
      return true;
    } else {
      toast.error(res.message);
      return false;
    }
  };

  const verifyEntry = async (reference: string) => {
    const res = await StorageService.verifyVehicleEntry(reference);
    if (res.success) {
      toast.success(res.message);
      await refreshData();
    } else {
      toast.error(res.message);
    }
    return res;
  };

  const verifyExit = async (reference: string) => {
    const res = await StorageService.verifyVehicleExit(reference);
    if (res.success) {
      toast.success(res.message);
      await refreshData();
    } else {
      toast.error(res.message);
    }
    return res;
  };

  const saveLocation = async (location: ParkingLocation) => {
    await StorageService.saveLocation(location);
    toast.success('Parking location saved successfully.');
    await refreshData();
  };

  const deleteLocation = async (locationId: string) => {
    await StorageService.deleteLocation(locationId);
    toast.success('Parking location deleted.');
    await refreshData();
  };

  const saveSlot = async (slot: ParkingSlot) => {
    await StorageService.saveSlot(slot);
    toast.success(`Slot ${slot.slotNumber} updated.`);
    await refreshData();
  };

  const deleteSlot = async (slotId: string) => {
    await StorageService.deleteSlot(slotId);
    toast.success('Slot removed.');
    await refreshData();
  };

  const updateSlotStatus = async (slotId: string, status: ParkingSlot['operationalStatus']) => {
    await StorageService.updateSlotOperationalStatus(slotId, status);
    toast.success(`Slot status updated to ${status}.`);
    await refreshData();
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await StorageService.markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, readStatus: true } : n))
    );
  };

  const resetAllData = async () => {
    await StorageService.resetDatabaseToDefault();
    toast.success('Database reset to college demo seed data!');
    await refreshData();
  };

  return (
    <BookingContext.Provider
      value={{
        locations,
        slots,
        bookings,
        userBookings,
        payments,
        notifications,
        unreadNotifsCount,
        stats,
        loading,
        refreshData,
        calculateFee,
        createBooking,
        cancelBooking,
        verifyEntry,
        verifyExit,
        saveLocation,
        deleteLocation,
        saveSlot,
        deleteSlot,
        updateSlotStatus,
        markNotificationAsRead,
        resetAllData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
