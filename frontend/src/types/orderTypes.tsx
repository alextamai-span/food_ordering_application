export interface OrderTypes {
    id: any;
    user_id: string | number;
    total_price: number;
    order_status: 'Pending' | 'Completed' | 'Cancelled';
    created_at: string | Date;
    completed_at?: string;
    foodItems?: {
        itemName: string;
        quantity: number;
    }[];
}

export interface OrderErrors {
    id: any;
    item_name: string;
    price: string;
    quantity: string;
    available: string;
}