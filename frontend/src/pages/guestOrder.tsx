import '../App.css'
import { useEffect, useState } from "react";
import { OrderTypes } from "../types/orderTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';

import AccountPopUp from '../components/accountPopUp';

export default function GuestOrder() {
    const navigate = useNavigate();
    const { token, id } = useAuth();

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const [orders, setOrders] = useState<Pick<OrderTypes, 'id' | 'total_price' | 'order_status' | 'foodItems'>[]>([]);
    const [showAccountPopUp, setShowAccountPopUp] = useState(false);

    useEffect(() => {
        if (token && id) {
            const loadOrders = async () => {
                try {
                    const guestOrders = await fetchUserOrders(token, id);
                    setOrders(guestOrders);
                }
                catch (err: any) {
                    toast.error("Failed to load orders.")
                }
            };
            loadOrders();
        }
    }, [token, id]);


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
                
                <button className="niceBtn" onClick={() => navigate("/guest/menu")}>View Menu</button>
                
                <button className="niceBtn" onClick={() => navigate("/cart")}>View Cart</button>

                <table>
                    {/* header row */}
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Total Price</th>
                            <th>Order Status</th>
                        </tr>
                    </thead>

                    {/* data rows */}
                    <tbody>
                        { orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order.id || `order-${index}`}>
                                    <td>{order.id}</td>
                                    <td>${Number(order.total_price).toFixed(2)}</td>
                                    <td>{order.order_status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    No orders yet. Click "Add Order" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>

            <footer>
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