import '../App.css'
import { useEffect, useState } from "react";
import { OrderTypes } from "../types/orderTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, deleteOrder } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';

import EditOrderPopUp from '../components/editOrder';
import AccountPopUp from '../components/accountPopUp';

export default function EmpMenu() {
    const navigate = useNavigate();
    const { token } = useAuth();

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const [orders, setOrders] = useState<OrderTypes[]>([]);
    const [showEditOrderPopUp, setshowEditOrderPopUp] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderTypes | null>(null);
    const [showAccountPopUp, setShowAccountPopUp] = useState(false);

    useEffect(() => {
        if (token) {
            const loadOrders = async () => {
                try {
                    const empOrders = await fetchAllOrders(token);
                    setOrders(empOrders);
                }
                catch (err: any) {
                    toast.error("Failed to load orders.")
                }
            };
            loadOrders();
        }
    }, [token]);

    // delete an order
    const handleDelete = async (id: number) => {
        try {
            await deleteOrder(id, token);
            const empOrders = await fetchAllOrders(token);
            setOrders(empOrders);
            toast.success("Item deleted");
        }
        catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <>
            <header>
                <h1>Welcome to the Food Ordering Application</h1>

                <button 
                    className="niceBtn"
                    onClick={() => setShowAccountPopUp(true)}
                > Account
                </button>
            </header>

            <main>
                <h2>Orders Menu</h2>
                
                <button className="niceBtn" onClick={() => navigate("/emp/menu")}>View Menu</button>
                
                <button className="niceBtn" onClick={() => navigate("/guest/menu")}>Add Order</button>

                <table>
                    {/* header row */}
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Total Price</th>
                            <th>Order Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th> 
                        </tr>
                    </thead>

                    {/* data rows */}
                    <tbody>
                        { orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order.id || `order-${index}`}>
                                    <td>{order.user_id}</td>
                                    <td>${order.total_price.toFixed(2)}</td>
                                    <td>{order.order_status}</td>
                                    <td>{new Date(order.created_at).toLocaleString()}</td>
                                    <td>{order.completed_at ? new Date(order.completed_at).toLocaleString() : 'Pending'}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setshowEditOrderPopUp(true);
                                            }}
                                        >
                                            <img src="/edit.png" alt="Update Order" />
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(order.id)}
                                        >
                                            <img src="/trash.png" alt="Delete Order" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>
                                    No orders yet. Click "Add Order" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>

            <footer>
                { 
                    showEditOrderPopUp &&
                    selectedOrder && 
                    ( <EditOrderPopUp
                        order={selectedOrder}
                        token={token}
                        onClose={async () => {
                            setshowEditOrderPopUp(false);
                            setSelectedOrder(null);
                            const empOrders = await fetchAllOrders(token);
                            setOrders(empOrders);
                        }}
                        onOrderUpdated={(updatedItem: OrderTypes) => 
                            setOrders(prev => prev.map(
                                item => item.id === updatedItem.id ? updatedItem : item
                            ))
                        }
                        />
                    )
                }
                {
                    showAccountPopUp &&
                    ( <AccountPopUp
                        onClose={() => setShowAccountPopUp(false)} />
                    )
                }
            </footer>
        </>
    );
}