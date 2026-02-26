export interface Order {
  id: number;
  guest_id: number;
  total_price: number;
  order_status: string;
  created_at: Date;
  completed_at: Date | null;
}

