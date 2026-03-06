export interface CartItem {
  id: number;
  user_id: number;
  menu_item_id: number;
  item_name: string;
  price: number;
  quantity: number;
  line_total: number;
}