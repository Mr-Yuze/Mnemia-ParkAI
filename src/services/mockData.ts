import type { ParkingLocation, ParkingSlot, Booking, PaymentRecord, NotificationItem, UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'admin-usr-01',
    name: 'Admin Supervisor',
    email: 'admin@parkai.com',
    phone: '+91 98765 43210',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    uid: 'demo-usr-02',
    name: 'Rahul Sharma',
    email: 'user@parkai.com',
    phone: '+91 91234 56789',
    role: 'user',
    vehicles: [
      { vehicleNumber: 'KA-01-AB-1234', vehicleType: 'Car', nickname: 'Family Sedan' },
      { vehicleNumber: 'KA-05-EV-9999', vehicleType: 'EV', nickname: 'Electric Nexon' },
    ],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export const INITIAL_LOCATIONS: ParkingLocation[] = [
  {
    locationId: 'loc-01',
    name: 'Mnemia Grand Mall & Hub',
    address: '88 MG Boulevard, Central Business District',
    city: 'Bangalore',
    description: 'Multi-level smart parking facility with 12 fast EV charging bays, automated guidance sensors, and direct skywalk mall entry.',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    openingHours: '24 Hours (Open 7 Days)',
    hourlyRate: 40,
    pricingRules: {
      hourlyRate: 40,
      evSurcharge: 20,
      peakHourMultiplier: 1.25,
    },
    totalSlots: 18,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    locationId: 'loc-02',
    name: 'TechZone Cyber Park P2',
    address: 'Gate 4, Electronics City Phase 1',
    city: 'Bangalore',
    description: 'Corporate smart parking facility with automated license plate recognition cameras, reserved visitor docks, and covered bays.',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    openingHours: '06:00 AM – 11:30 PM',
    hourlyRate: 30,
    pricingRules: {
      hourlyRate: 30,
      evSurcharge: 15,
      peakHourMultiplier: 1.15,
    },
    totalSlots: 15,
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
  {
    locationId: 'loc-03',
    name: 'Apex Aerocity Terminal T2 Bay',
    address: 'International Airport Corridor Road',
    city: 'Bangalore Airport',
    description: 'High-security airport terminal parking with 24/7 security escorts, fast check-in shuttles, and priority disability bays.',
    imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
    openingHours: '24 Hours (Round the Clock)',
    hourlyRate: 60,
    pricingRules: {
      hourlyRate: 60,
      evSurcharge: 25,
      peakHourMultiplier: 1.3,
    },
    totalSlots: 12,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
];

export const generateInitialSlots = (locations: ParkingLocation[]): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];

  locations.forEach((loc) => {
    for (let i = 1; i <= loc.totalSlots; i++) {
      const padNum = i < 10 ? `0${i}` : `${i}`;
      let slotType: ParkingSlot['slotType'] = 'Standard';
      let floor = 'Ground Floor';

      if (i <= 3) {
        slotType = 'EV';
        floor = 'Ground Floor (EV Bay)';
      } else if (i === 4) {
        slotType = 'Handicapped';
        floor = 'Ground Floor (Priority)';
      } else if (i === 5 || i === 6) {
        slotType = 'VIP';
        floor = 'Level 1 (Executive)';
      } else if (i > 10) {
        floor = 'Level 2';
      }

      // First slot occupied for demo realism
      const operationalStatus = (i === 7) ? 'occupied' : (i === 12 ? 'maintenance' : 'available');

      slots.push({
        slotId: `slot-${loc.locationId}-${padNum}`,
        locationId: loc.locationId,
        slotNumber: `${loc.locationId === 'loc-01' ? 'A' : loc.locationId === 'loc-02' ? 'B' : 'C'}-${padNum}`,
        slotType,
        floor,
        operationalStatus,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      });
    }
  });

  return slots;
};

export const INITIAL_SLOTS: ParkingSlot[] = generateInitialSlots(INITIAL_LOCATIONS);

const now = new Date();
const formatIso = (date: Date) => date.toISOString();

export const INITIAL_BOOKINGS: Booking[] = [
  {
    bookingId: 'MNM-BK-1001',
    userId: 'demo-usr-02',
    userName: 'Rahul Sharma',
    userEmail: 'user@parkai.com',
    userPhone: '+91 91234 56789',
    locationId: 'loc-01',
    locationName: 'Mnemia Grand Mall & Hub',
    slotId: 'slot-loc-01-01',
    slotNumber: 'A-01',
    vehicleNumber: 'KA-05-EV-9999',
    vehicleType: 'EV',
    startTime: formatIso(new Date(now.getTime() + 2 * 3600000)), // 2 hours from now
    endTime: formatIso(new Date(now.getTime() + 5 * 3600000)), // 5 hours from now
    durationHours: 3,
    bookingStatus: 'upcoming',
    totalAmount: 180, // (40 + 20 ev) * 3
    paymentId: 'PAY-TXN-8849',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    qrCodeData: JSON.stringify({
      bookingId: 'MNM-BK-1001',
      slot: 'A-01',
      vehicle: 'KA-05-EV-9999',
      system: 'MNEMIA-PARKAI-VERIFY',
    }),
    createdAt: formatIso(new Date(now.getTime() - 4 * 3600000)),
  },
  {
    bookingId: 'MNM-BK-1002',
    userId: 'demo-usr-02',
    userName: 'Rahul Sharma',
    userEmail: 'user@parkai.com',
    userPhone: '+91 91234 56789',
    locationId: 'loc-01',
    slotId: 'slot-loc-01-07',
    slotNumber: 'A-07',
    locationName: 'Mnemia Grand Mall & Hub',
    vehicleNumber: 'KA-01-AB-1234',
    vehicleType: 'Car',
    startTime: formatIso(new Date(now.getTime() - 1 * 3600000)),
    endTime: formatIso(new Date(now.getTime() + 3 * 3600000)),
    durationHours: 4,
    bookingStatus: 'active',
    entryTime: formatIso(new Date(now.getTime() - 50 * 60000)),
    totalAmount: 160,
    paymentId: 'PAY-TXN-8850',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    qrCodeData: JSON.stringify({
      bookingId: 'MNM-BK-1002',
      slot: 'A-07',
      vehicle: 'KA-01-AB-1234',
      system: 'MNEMIA-PARKAI-VERIFY',
    }),
    createdAt: formatIso(new Date(now.getTime() - 5 * 3600000)),
  },
  {
    bookingId: 'MNM-BK-1000',
    userId: 'demo-usr-02',
    userName: 'Rahul Sharma',
    userEmail: 'user@parkai.com',
    userPhone: '+91 91234 56789',
    locationId: 'loc-02',
    locationName: 'TechZone Cyber Park P2',
    slotId: 'slot-loc-02-02',
    slotNumber: 'B-02',
    vehicleNumber: 'KA-01-AB-1234',
    vehicleType: 'Car',
    startTime: formatIso(new Date(now.getTime() - 28 * 3600000)),
    endTime: formatIso(new Date(now.getTime() - 25 * 3600000)),
    durationHours: 3,
    bookingStatus: 'completed',
    entryTime: formatIso(new Date(now.getTime() - 28 * 3600000 + 5 * 60000)),
    exitTime: formatIso(new Date(now.getTime() - 25 * 3600000)),
    totalAmount: 90,
    paymentId: 'PAY-TXN-8840',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    qrCodeData: JSON.stringify({
      bookingId: 'MNM-BK-1000',
      slot: 'B-02',
      vehicle: 'KA-01-AB-1234',
      system: 'MNEMIA-PARKAI-VERIFY',
    }),
    createdAt: formatIso(new Date(now.getTime() - 30 * 3600000)),
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    paymentId: 'PAY-TXN-8849',
    bookingId: 'MNM-BK-1001',
    userId: 'demo-usr-02',
    amount: 180,
    paymentMethod: 'UPI',
    paymentStatus: 'success',
    transactionReference: 'UPI/REF-9402847192',
    gatewayProvider: 'Razorpay / UPI Sandbox',
    createdAt: formatIso(new Date(now.getTime() - 4 * 3600000)),
  },
  {
    paymentId: 'PAY-TXN-8850',
    bookingId: 'MNM-BK-1002',
    userId: 'demo-usr-02',
    amount: 160,
    paymentMethod: 'Card',
    paymentStatus: 'success',
    transactionReference: 'CARD/AUTH-4491028',
    gatewayProvider: 'Mnemia Digital Gateway',
    createdAt: formatIso(new Date(now.getTime() - 5 * 3600000)),
  },
  {
    paymentId: 'PAY-TXN-8840',
    bookingId: 'MNM-BK-1000',
    userId: 'demo-usr-02',
    amount: 90,
    paymentMethod: 'UPI',
    paymentStatus: 'success',
    transactionReference: 'UPI/REF-7719283921',
    gatewayProvider: 'Razorpay / UPI Sandbox',
    createdAt: formatIso(new Date(now.getTime() - 30 * 3600000)),
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notificationId: 'notif-01',
    userId: 'demo-usr-02',
    title: 'Booking Confirmed (A-01)',
    message: 'Your slot A-01 at Mnemia Grand Mall & Hub is reserved for today. Ready for arrival!',
    readStatus: false,
    type: 'booking',
    createdAt: formatIso(new Date(now.getTime() - 4 * 3600000)),
  },
  {
    notificationId: 'notif-02',
    userId: 'demo-usr-02',
    title: 'Vehicle Entry Logged',
    message: 'Vehicle KA-01-AB-1234 was successfully verified and entered slot A-07.',
    readStatus: true,
    type: 'entry',
    createdAt: formatIso(new Date(now.getTime() - 50 * 60000)),
  },
];
