import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import {
  INITIAL_LOCATIONS,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '../services/mockData';

/**
 * Seed all initial smart parking facilities, slots, test users, and bookings into live Firestore
 */
export async function seedFirestoreDatabase(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      message: 'Firebase credentials not configured in .env. Running in local persistent storage mode.',
    };
  }

  try {
    const batch = writeBatch(db);

    // Seed Users
    for (const user of INITIAL_USERS) {
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, user, { merge: true });
    }

    // Seed Locations
    for (const loc of INITIAL_LOCATIONS) {
      const locRef = doc(db, 'parkingLocations', loc.locationId);
      batch.set(locRef, loc, { merge: true });
    }

    // Seed Slots
    for (const slot of INITIAL_SLOTS) {
      const slotRef = doc(db, 'parkingSlots', slot.slotId);
      batch.set(slotRef, slot, { merge: true });
    }

    // Seed Bookings
    for (const booking of INITIAL_BOOKINGS) {
      const bkRef = doc(db, 'bookings', booking.bookingId);
      batch.set(bkRef, booking, { merge: true });
    }

    // Seed Payments
    for (const payment of INITIAL_PAYMENTS) {
      const pmtRef = doc(db, 'payments', payment.paymentId);
      batch.set(pmtRef, payment, { merge: true });
    }

    // Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      const nRef = doc(db, 'notifications', notif.notificationId);
      batch.set(nRef, notif, { merge: true });
    }

    await batch.commit();
    console.log('✅ Firestore populated with Mnemia ParkAI seed dataset successfully!');
    return {
      success: true,
      message: 'Cloud Firestore successfully seeded with all locations, slots, and demo bookings!',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Firestore seeding error:', error);
    return {
      success: false,
      message: `Firestore seeding error: ${msg}`,
    };
  }
}
