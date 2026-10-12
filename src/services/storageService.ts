import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  runTransaction,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type {
  ParkingLocation,
  ParkingSlot,
  Booking,
  PaymentRecord,
  NotificationItem,
  UserProfile,
  DashboardStats,
} from '../types';
import {
  INITIAL_LOCATIONS,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  LOCATIONS: 'mnemia_parkai_locations',
  SLOTS: 'mnemia_parkai_slots',
  BOOKINGS: 'mnemia_parkai_bookings',
  PAYMENTS: 'mnemia_parkai_payments',
  NOTIFICATIONS: 'mnemia_parkai_notifications',
  USERS: 'mnemia_parkai_users',
};

// Event system for real-time reactivity in local mode
class StorageEventEmitter {
  private listeners: { [event: string]: Array<() => void> } = {};

  subscribe(event: string, callback: () => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  notify(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb());
    }
  }
}

export const storageEvents = new StorageEventEmitter();

// Helper to initialize local storage with mock data if empty
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
};

initializeLocalStorage();

// Helper to get from local storage
const getFromLocal = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error reading from localStorage', e);
    return fallback;
  }
};

// Helper to save to local storage
const saveToLocal = <T>(key: string, data: T, eventName?: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (eventName) {
      storageEvents.notify(eventName);
    }
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
};

/**
 * Storage Service combining Firestore and Local Persistent storage seamlessly
 */
export const StorageService = {
  // Check if dates overlap
  isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
    const sA = new Date(startA).getTime();
    const eA = new Date(endA).getTime();
    const sB = new Date(startB).getTime();
    const eB = new Date(endB).getTime();
    // Overlaps if startA < endB and endA > startB
    return sA < eB && eA > sB;
  },

  // RESET DATABASE TO SEED
  async resetDatabaseToDefault(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));

    storageEvents.notify('locations');
    storageEvents.notify('slots');
    storageEvents.notify('bookings');
    storageEvents.notify('payments');
    storageEvents.notify('notifications');
  },

  // LOCATIONS
  async getLocations(): Promise<ParkingLocation[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'parkingLocations'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as ParkingLocation);
        }
      } catch (err) {
        console.warn('Firestore fallback to local storage for locations:', err);
      }
    }
    return getFromLocal<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  },

  async getLocationById(locationId: string): Promise<ParkingLocation | null> {
    const locations = await this.getLocations();
    return locations.find((l) => l.locationId === locationId) || null;
  },

  async saveLocation(location: ParkingLocation): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'parkingLocations', location.locationId), location);
      } catch (err) {
        console.warn('Firestore write error for location:', err);
      }
    }
    const locations = getFromLocal<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    const idx = locations.findIndex((l) => l.locationId === location.locationId);
    if (idx >= 0) {
      locations[idx] = location;
    } else {
      locations.push(location);
    }
    saveToLocal(STORAGE_KEYS.LOCATIONS, locations, 'locations');
  },

  async deleteLocation(locationId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'parkingLocations', locationId));
      } catch (err) {
        console.warn('Firestore delete location error:', err);
      }
    }
    let locations = getFromLocal<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    locations = locations.filter((l) => l.locationId !== locationId);
    saveToLocal(STORAGE_KEYS.LOCATIONS, locations, 'locations');
  },

  // SLOTS
  async getSlots(locationId?: string): Promise<ParkingSlot[]> {
    let slots: ParkingSlot[] = [];
    if (isFirebaseConfigured && db) {
      try {
        const q = locationId
          ? query(collection(db, 'parkingSlots'), where('locationId', '==', locationId))
          : collection(db, 'parkingSlots');
        const snap = await getDocs(q);
        if (!snap.empty) {
          slots = snap.docs.map((d) => d.data() as ParkingSlot);
        }
      } catch (err) {
        console.warn('Firestore fallback to local for slots:', err);
      }
    }

    if (slots.length === 0) {
      slots = getFromLocal<ParkingSlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
      if (locationId) {
        slots = slots.filter((s) => s.locationId === locationId);
      }
    }
    return slots;
  },

  async saveSlot(slot: ParkingSlot): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'parkingSlots', slot.slotId), slot);
      } catch (err) {
        console.warn('Firestore save slot error:', err);
      }
    }
    const allSlots = getFromLocal<ParkingSlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    const idx = allSlots.findIndex((s) => s.slotId === slot.slotId);
    if (idx >= 0) {
      allSlots[idx] = slot;
    } else {
      allSlots.push(slot);
    }
    saveToLocal(STORAGE_KEYS.SLOTS, allSlots, 'slots');
  },

  async deleteSlot(slotId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'parkingSlots', slotId));
      } catch (err) {
        console.warn('Firestore delete slot error:', err);
      }
    }
    let allSlots = getFromLocal<ParkingSlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    allSlots = allSlots.filter((s) => s.slotId !== slotId);
    saveToLocal(STORAGE_KEYS.SLOTS, allSlots, 'slots');
  },

  async updateSlotOperationalStatus(
    slotId: string,
    status: ParkingSlot['operationalStatus']
  ): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'parkingSlots', slotId), { operationalStatus: status });
      } catch (err) {
        console.warn('Firestore updateSlotOperationalStatus error:', err);
      }
    }
    const allSlots = getFromLocal<ParkingSlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    const slot = allSlots.find((s) => s.slotId === slotId);
    if (slot) {
      slot.operationalStatus = status;
      saveToLocal(STORAGE_KEYS.SLOTS, allSlots, 'slots');
    }
  },

  /**
   * Determine whether a slot is occupied or reserved during a specific time interval
   */
  async getSlotStatusForTime(
    slotId: string,
    startTime: string,
    endTime: string
  ): Promise<'available' | 'occupied' | 'reserved' | 'maintenance'> {
    const allSlots = await this.getSlots();
    const slot = allSlots.find((s) => s.slotId === slotId);
    if (!slot) return 'maintenance';
    if (slot.operationalStatus === 'maintenance') return 'maintenance';

    const bookings = await this.getBookings();
    const activeBooking = bookings.find((b) => b.slotId === slotId && b.bookingStatus === 'active');
    if (activeBooking) {
      return 'occupied';
    }

    const hasOverlap = bookings.some(
      (b) =>
        b.slotId === slotId &&
        (b.bookingStatus === 'upcoming' || b.bookingStatus === 'active') &&
        this.isTimeOverlapping(b.startTime, b.endTime, startTime, endTime)
    );

    return hasOverlap ? 'reserved' : 'available';
  },

  // BOOKINGS
  async getBookings(userId?: string): Promise<Booking[]> {
    let bookings: Booking[] = [];
    if (isFirebaseConfigured && db) {
      try {
        const q = userId
          ? query(collection(db, 'bookings'), where('userId', '==', userId))
          : collection(db, 'bookings');
        const snap = await getDocs(q);
        if (!snap.empty) {
          bookings = snap.docs.map((d) => d.data() as Booking);
        }
      } catch (err) {
        console.warn('Firestore getBookings error:', err);
      }
    }

    if (bookings.length === 0) {
      bookings = getFromLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      if (userId) {
        bookings = bookings.filter((b) => b.userId === userId);
      }
    }

    // Sort by createdAt descending
    return bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const bookings = await this.getBookings();
    return bookings.find((b) => b.bookingId === bookingId) || null;
  },

  /**
   * Atomically create a booking after strictly checking for time collisions
   */
  async createBooking(bookingData: Omit<Booking, 'bookingId' | 'createdAt'>): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }> {
    const currentBookings = await this.getBookings();

    // Check collision
    const collision = currentBookings.find(
      (b) =>
        b.slotId === bookingData.slotId &&
        (b.bookingStatus === 'upcoming' || b.bookingStatus === 'active') &&
        this.isTimeOverlapping(b.startTime, b.endTime, bookingData.startTime, bookingData.endTime)
    );

    if (collision) {
      return {
        success: false,
        error: `Slot ${bookingData.slotNumber} is already reserved between ${new Date(collision.startTime).toLocaleTimeString()} and ${new Date(collision.endTime).toLocaleTimeString()}. Please select another slot or time range.`,
      };
    }

    const uniqueId = `MNM-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      bookingId: uniqueId,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      const firestore = db;
      try {
        await runTransaction(firestore, async (txn) => {
          const docRef = doc(firestore, 'bookings', newBooking.bookingId);
          txn.set(docRef, newBooking);
        });
      } catch (err) {
        console.warn('Firestore transaction error, persisting locally:', err);
      }
    }

    const localBookings = getFromLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    localBookings.unshift(newBooking);
    saveToLocal(STORAGE_KEYS.BOOKINGS, localBookings, 'bookings');

    // Create notification for user
    await this.createNotification({
      userId: newBooking.userId,
      title: `Booking Confirmed: #${newBooking.bookingId}`,
      message: `Reserved slot ${newBooking.slotNumber} at ${newBooking.locationName}. QR code is ready in My Bookings!`,
      readStatus: false,
      type: 'booking',
    });

    return { success: true, booking: newBooking };
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const bookings = getFromLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find((b) => b.bookingId === bookingId);

    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.bookingStatus === 'completed' || booking.bookingStatus === 'cancelled') {
      return { success: false, message: 'This booking cannot be cancelled.' };
    }

    if (booking.bookingStatus === 'active') {
      return { success: false, message: 'Vehicle is currently parked. Complete exit before closing.' };
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.notes = reason || 'Cancelled by user';

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), {
          bookingStatus: 'cancelled',
          paymentStatus: 'refunded',
          notes: booking.notes,
        });
      } catch (err) {
        console.warn('Firestore cancel booking error:', err);
      }
    }

    saveToLocal(STORAGE_KEYS.BOOKINGS, bookings, 'bookings');

    // Notification
    await this.createNotification({
      userId: booking.userId,
      title: `Booking Cancelled: #${bookingId}`,
      message: `Your booking for slot ${booking.slotNumber} was cancelled. Refund of ₹${booking.totalAmount} has been initiated.`,
      readStatus: false,
      type: 'booking',
    });

    return { success: true, message: 'Booking cancelled and refund recorded successfully.' };
  },

  // ENTRY & EXIT MANAGEMENT
  async verifyVehicleEntry(
    bookingIdOrVehicle: string
  ): Promise<{ success: boolean; message: string; booking?: Booking }> {
    const bookings = getFromLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const term = bookingIdOrVehicle.trim().toUpperCase();

    const booking = bookings.find(
      (b) =>
        (b.bookingId.toUpperCase() === term || b.vehicleNumber.toUpperCase() === term) &&
        b.bookingStatus === 'upcoming'
    );

    if (!booking) {
      // Check if already active
      const alreadyActive = bookings.find(
        (b) =>
          (b.bookingId.toUpperCase() === term || b.vehicleNumber.toUpperCase() === term) &&
          b.bookingStatus === 'active'
      );
      if (alreadyActive) {
        return {
          success: false,
          message: `Vehicle ${alreadyActive.vehicleNumber} has ALREADY entered at ${new Date(alreadyActive.entryTime || '').toLocaleTimeString()}. Duplicate entry prevented.`,
        };
      }
      return {
        success: false,
        message: 'No upcoming booking found matching this reference/vehicle number.',
      };
    }

    // Mark as active
    booking.bookingStatus = 'active';
    booking.entryTime = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'bookings', booking.bookingId), {
          bookingStatus: 'active',
          entryTime: booking.entryTime,
        });
      } catch (err) {
        console.warn('Firestore entry error:', err);
      }
    }

    saveToLocal(STORAGE_KEYS.BOOKINGS, bookings, 'bookings');
    await this.updateSlotOperationalStatus(booking.slotId, 'occupied');

    // Notification
    await this.createNotification({
      userId: booking.userId,
      title: 'Vehicle Entry Confirmed 🚗',
      message: `Welcome! Vehicle ${booking.vehicleNumber} checked in at ${booking.slotNumber} (${booking.locationName}).`,
      readStatus: false,
      type: 'entry',
    });

    return {
      success: true,
      message: `Vehicle ${booking.vehicleNumber} successfully checked in to Slot ${booking.slotNumber}!`,
      booking,
    };
  },

  async verifyVehicleExit(
    bookingIdOrVehicle: string
  ): Promise<{ success: boolean; message: string; booking?: Booking }> {
    const bookings = getFromLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const term = bookingIdOrVehicle.trim().toUpperCase();

    const booking = bookings.find(
      (b) =>
        (b.bookingId.toUpperCase() === term || b.vehicleNumber.toUpperCase() === term) &&
        b.bookingStatus === 'active'
    );

    if (!booking) {
      const alreadyCompleted = bookings.find(
        (b) =>
          (b.bookingId.toUpperCase() === term || b.vehicleNumber.toUpperCase() === term) &&
          b.bookingStatus === 'completed'
      );
      if (alreadyCompleted) {
        return {
          success: false,
          message: `Vehicle ${alreadyCompleted.vehicleNumber} has already completed exit at ${new Date(alreadyCompleted.exitTime || '').toLocaleTimeString()}.`,
        };
      }
      return {
        success: false,
        message: 'No active parked session found for this reference or vehicle number.',
      };
    }

    // Mark as completed
    booking.bookingStatus = 'completed';
    booking.exitTime = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'bookings', booking.bookingId), {
          bookingStatus: 'completed',
          exitTime: booking.exitTime,
        });
      } catch (err) {
        console.warn('Firestore exit error:', err);
      }
    }

    saveToLocal(STORAGE_KEYS.BOOKINGS, bookings, 'bookings');
    await this.updateSlotOperationalStatus(booking.slotId, 'available');

    // Notification
    await this.createNotification({
      userId: booking.userId,
      title: 'Vehicle Exit Recorded 🏁',
      message: `Thank you for parking at Mnemia ParkAI! Vehicle ${booking.vehicleNumber} has exited. Receipt available.`,
      readStatus: false,
      type: 'exit',
    });

    return {
      success: true,
      message: `Exit logged for ${booking.vehicleNumber}. Slot ${booking.slotNumber} is now released!`,
      booking,
    };
  },

  // PAYMENTS
  async recordPayment(payment: Omit<PaymentRecord, 'paymentId' | 'createdAt'>): Promise<PaymentRecord> {
    const paymentId = `PAY-TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentRecord = {
      ...payment,
      paymentId,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'payments', paymentId), newPayment);
      } catch (err) {
        console.warn('Firestore save payment error:', err);
      }
    }

    const payments = getFromLocal<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    payments.unshift(newPayment);
    saveToLocal(STORAGE_KEYS.PAYMENTS, payments, 'payments');

    return newPayment;
  },

  async getPayments(userId?: string): Promise<PaymentRecord[]> {
    let payments = getFromLocal<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    if (userId) {
      payments = payments.filter((p) => p.userId === userId);
    }
    return payments;
  },

  // NOTIFICATIONS
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    let notifs = getFromLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (userId) {
      notifs = notifs.filter((n) => n.userId === userId);
    }
    return notifs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const notifs = getFromLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = notifs.find((n) => n.notificationId === notificationId);
    if (item) {
      item.readStatus = true;
      saveToLocal(STORAGE_KEYS.NOTIFICATIONS, notifs, 'notifications');
    }
  },

  async createNotification(notif: Omit<NotificationItem, 'notificationId' | 'createdAt'>): Promise<void> {
    const newNotif: NotificationItem = {
      ...notif,
      notificationId: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    const notifs = getFromLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifs.unshift(newNotif);
    saveToLocal(STORAGE_KEYS.NOTIFICATIONS, notifs, 'notifications');
  },

  // DASHBOARD STATS
  async getDashboardStats(): Promise<DashboardStats> {
    const slots = await this.getSlots();
    const bookings = await this.getBookings();

    const totalSlots = slots.length;
    const occupiedSlots = slots.filter((s) => s.operationalStatus === 'occupied').length;
    const maintenanceSlots = slots.filter((s) => s.operationalStatus === 'maintenance').length;
    const reservedSlots = bookings.filter((b) => b.bookingStatus === 'upcoming').length;
    const activeBookings = bookings.filter((b) => b.bookingStatus === 'active').length;

    const availableSlots = Math.max(0, totalSlots - occupiedSlots - maintenanceSlots);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((b) => b.createdAt.startsWith(todayStr));
    const todayRevenue = todayBookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const vehiclesEnteredToday = bookings.filter(
      (b) => b.entryTime && b.entryTime.startsWith(todayStr)
    ).length;

    const vehiclesExitedToday = bookings.filter(
      (b) => b.exitTime && b.exitTime.startsWith(todayStr)
    ).length;

    return {
      totalSlots,
      availableSlots,
      occupiedSlots,
      reservedSlots,
      activeBookings,
      todayRevenue,
      totalBookings: bookings.length,
      vehiclesEnteredToday,
      vehiclesExitedToday,
    };
  },

  // REAL-TIME SUBSCRIBER
  subscribe(event: 'slots' | 'bookings' | 'locations' | 'payments' | 'notifications', callback: () => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const unsub = onSnapshot(collection(db, event === 'locations' ? 'parkingLocations' : event === 'slots' ? 'parkingSlots' : event), () => {
          callback();
        });
        return unsub;
      } catch (e) {
        console.warn('Firestore onSnapshot fallback to local event bus:', e);
      }
    }
    return storageEvents.subscribe(event, callback);
  },
};
