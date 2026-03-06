import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { OrderTypes } from '../types/orderTypes';
import { editOrderDetails } from '../services/orderService';

interface EditOrderProps {
    order: OrderTypes;
    onClose: () => void;
    onOrderUpdated: (order: OrderTypes) => void;
    token: string;
}

const EditOrderPopUp: React.FC<EditOrderProps> = ({
    order,
    onClose,
    onOrderUpdated,
    token
}) => {
    const [editOrderData, setEditOrderData] = useState<OrderTypes>({ ...order });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await editOrderDetails(editOrderData, token);
            if (response.success && response.data) {
                onOrderUpdated(response.data);
                onClose();
            }
            else {
                toast.error("Failed to update order.");
            }
        }
        catch (err: any) {
            toast.error("Failed to update order.");
        }
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <h2>Edit Order</h2>

                <form className="form-input" onSubmit={handleSubmit}>
                    <label>Order Number:  {editOrderData.id}</label>
                    <label>User ID:  {editOrderData.user_id}</label>
                    <label>Order Price: ${editOrderData.total_price.toFixed(2)}</label>
                    <label>Created At: {new Date(editOrderData.created_at).toLocaleString()}</label>
                    <br />
                    
                    <label htmlFor="order_status">Order Status:</label>
                    <select
                        name="order_status"
                        id="order_status"
                        value={editOrderData.order_status}
                        onChange={(e) =>
                            setEditOrderData(prev => ({ ...prev, order_status: e.target.value as OrderTypes['order_status'] }))
                        }
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <label htmlFor="completed_at">Completed At:</label>
                    <input
                        type="datetime-local"
                        name="completed_at"
                        id="completed_at"
                        value={editOrderData.completed_at || ''}
                        onChange={(e) =>
                            setEditOrderData(prev => ({ 
                                ...prev, 
                                completed_at: e.target.value
                            }))
                        }
                        placeholder="Completed At"
                    />
                </form>

                <button type="submit" className="niceBtn" onClick={handleSubmit}>
                    Save
                </button>

                <button type="button" className="niceBtn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditOrderPopUp;