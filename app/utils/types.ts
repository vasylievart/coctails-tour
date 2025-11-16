export type Booking = {
  id: string;
  slot_id: number;
  booking_date: string;
  booking_hour: string;
  people_count: number;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  comment: string;
  created_at: Date;
  amount: number;
  private_tour: boolean;
  canceled: boolean;
  active: boolean;
}

export type Slots = {
  id: number;
  slot_date: string;
  slot_hour: string;
  capacity_total: number;
  capacity_left: number;
  disabled?: boolean;
  price?: number;
}