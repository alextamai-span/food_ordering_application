export interface ItemTypes {
    id: any;
    item_name: string;
    price: number;
    quantity: number;
    available: boolean;
}

export interface ItemErrors {
    id: any;
    item_name: string;
    price: string;
    quantity: string;
    available: string;
}