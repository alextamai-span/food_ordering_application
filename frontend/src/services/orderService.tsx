import { OrderTypes } from "../types/orderTypes";
import { ServiceResponse } from "../types/accountTypes";

// fetch all orders for the employee
export const fetchAllOrders = async (token: string): Promise<OrderTypes[]> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/order/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch orders for employee");
        }

        const result = await response.json();
        return result;
    }
    catch (err: any) {
        console.error('Error fetching employee orders: ', err);
        throw err;
    }
};

// delete an order
export const deleteOrder = async (id: number, token: string): Promise<ServiceResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/order/delete_order${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete order");
        }

        const result = await response.json();
        return {
            success: true,
            message: "Order successfully deleted",
            data: result
        };
    }
    catch (err: any) {
        console.error('Error deleting order: ', err);
        return {
            success: false,
            message: "Failed to delete order"
        };
    }
};

// edit order details 
export const editOrderDetails = async (
    editOrderData: Pick<OrderTypes, 'id' | 'order_status' | 'completed_at'>,
    token: string
): Promise<ServiceResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/order/update_order${editOrderData.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(editOrderData),
        });

        if(!response.ok) {
            throw new Error('Failed to update the order details');
        }

        const result = await response.json();
        return {
            success: true,
            message: 'Order details successfully updated',
            data: result
        };
    }
    catch (err: any) {
        console.error('Failed to update order details: ', err);
        return {
            success: false,
            message: 'Failed to update order details'
        };
    }
};