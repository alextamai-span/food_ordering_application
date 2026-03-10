import '../App.css'
import { useEffect, useState } from "react";
import { ItemTypes } from "../types/menuItemTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { fetchGuestMenu } from '../services/guestService';
import  { addItemToCart } from '../services/cartService';

import AccountPopUp from '../components/accountPopUp';

export default function GuestMenu() {
    const navigate = useNavigate();
    const { token, account_type } = useAuth();

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const [items, setItems] = useState<Pick<ItemTypes, 'id' | 'item_name' | 'price'>[]>([]);
    const [showAccountPopUp, setShowAccountPopUp] = useState(false);

    useEffect(() => {
        if (token) {
            const loadMenu = async () => {
                try {
                    const guestMenu = await fetchGuestMenu(token);
                    setItems(guestMenu);
                }
                catch (err: any) {
                    toast.error("Failed to load menu.")
                }
            };
            loadMenu();
        }
    }, [token]);

    // add item to cart
    const handleAddItemToCart = async (menu_item_id: number) => {
        if (token) {
            try {
                await addItemToCart(token, menu_item_id);
                toast.success("Item added to cart!");
            }
            catch (err: any) {
                toast.error("Failed to add item to cart.");
            }
        }
    };

    return (
        <>
            <header>
                <h1>Welcome to the Food Ordering Application</h1>

                <button 
                    className="niceBtn"
                    onClick={() => setShowAccountPopUp(true) }
                > Account
                </button>
            </header>

            <main>
                <h2>Guest Menu</h2>
                <button className="niceBtn" onClick={() => navigate("/cart")}>View Cart</button>
                <button className="niceBtn" onClick={() => navigate("/guest/order")}>View Order</button>

                <table>
                    {/* header row */}
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Add to Cart</th>
                    </tr>
                    </thead>
                    
                    {/* data rows */}
                    <tbody>
                    { items.length > 0 ? 
                        items.map((item, index) => (
                            <tr key={item.id || `item-${index}`}>
                                <td>{item.item_name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="niceBtn"
                                        onClick={() => handleAddItemToCart(item.id)}
                                    > Add to Cart
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    No items yet.
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>

                <br></br>
                {account_type === 'employee' && (
                    <button className="niceBtn" onClick={() => navigate('/emp/menu')}>Return to Employee Account</button>
                )}
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