export type UserRole = 'user' | 'admin';

export interface UserVehicle {
  vehicleNumber: string;
  vehicleType: 'Car' | 'Bike' | 'EV' | 'SUV';
  nickname?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicles?: UserVehicle[];
  createdAt: string;
}

export interface ParkingPricing {
  hourlyRate: number;
  evSurcharge?: number;
  peakHourMultiplier?: number;
}

export interface ParkingLocation {
  locationId: string;
  name: string;
  address: string;
  city: string;
  description: string;
  imageUrl: string;
  openingHours: string;
  hourlyRate: number;
  pricingRules: ParkingPricing;
  totalSlots: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export type SlotType = 'Standard' | 'EV' | 'Handicapped' | 'VIP';
export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSlot {
  slotId: string;
  locationId: string;
  slotNumber: string; // e.g. A-01, B-05
  slotType: SlotType;
  floor: string; // e.g. Ground, Level 1
  operationalStatus: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
}

export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'success';
export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'CashAtEntry' | 'DemoGateway';

export interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  locationId: string;
  locationName: string;
  slotId: string;
  slotNumber: string;
  vehicleNumber: string;
  vehicleType: 'Car' | 'Bike' | 'EV' | 'SUV';
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationHours: number;
  bookingStatus: BookingStatus;
  entryTime?: string; // ISO string
  exitTime?: string; // ISO string
  totalAmount: number;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  qrCodeData: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference: string;
  gatewayProvider: string;
  createdAt: string;
}

export interface NotificationItem {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  readStatus: boolean;
  type: 'booking' | 'entry' | 'exit' | 'payment' | 'system';
  createdAt: string;
}

export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  reservedSlots: number;
  activeBookings: number;
  todayRevenue: number;
  totalBookings: number;
  vehiclesEnteredToday: number;
  vehiclesExitedToday: number;
}
