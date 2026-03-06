import '../App.css'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { placeGuestOrder } from '../services/orderService';
import { 
    clearCart, 
    fetchGuestCart,
    removeCartItem,
    updateCartItemQty, 
    afterCheckoutMenu
} from '../services/cartService';

import AccountPopUp from '../components/accountPopUp';
import { CartItem } from '../types/cartTypes';

export default function Cart() {
    const navigate = useNavigate();
    const { token, id } = useAuth();

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const [items, setItems] = useState<CartItem[]>([]);
    const [showAccountPopUp, setShowAccountPopUp] = useState(false);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [newQuantity, setNewQuantity] = useState(1);

    useEffect(() => {
        if (token) {
            const loadCart = async () => {
                try {
                    const cart = await fetchGuestCart(token);
                    setItems(cart);
                }
                catch (err: any) {
                    toast.error("Failed to load cart.")
                }
            };
            loadCart();
        }
    }, [token]);

    // remove item from cart
    const handleRemoveItem = async (menu_item_id: number) => {
        try {
            await removeCartItem(token, menu_item_id);
            
            const cart = await fetchGuestCart(token);
            setItems(cart);
            
            toast.success("Item deleted");
        }
        catch (error) {
            toast.error("Failed to delete item");
        }
    };

    // clear cart
    const handleClearCart = async () => {
        try {
            await clearCart(token);
            setItems([]);
            toast.success("Cart cleared");
        }
        catch (error) {
            toast.error("Failed to clear cart");
        }
    };

    // edit item quantity in cart
    const handleEditItem = (menu_item_id: number) => {
        const item = items.find((item) => item.menu_item_id === menu_item_id);
        if (item) {
            setEditingItem(item);
            setNewQuantity(item.quantity);
        }
    };

    const handleSaveQuantity = async () => {
        if (!editingItem || newQuantity < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }

        try {
            await updateCartItemQty(token, editingItem.menu_item_id, newQuantity);
            
            // Refresh cart
            const cart = await fetchGuestCart(token);
            setItems(cart);
            
            setEditingItem(null);
            toast.success("Quantity updated");
        }
        catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const handleCheckout = async () => {
        if (!token) {
            toast.error("Please login first");
            return;
        }

        if (!id || items.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        try {
            const result = await placeGuestOrder(token, id, total);

            if (!result.success) {
                toast.error(result.message || "Checkout failed");
                return;
            }

            for (const item of items) {
                const updateMenu = await afterCheckoutMenu(token, item.menu_item_id, item.quantity);

                if (!updateMenu.data.success) {
                    toast.error(updateMenu.data.message || "Failed to update menu stock");
                    navigate('/cart');
                    return;
                }
            }

            await clearCart(token);
            setItems([]);
            toast.success("Order placed successfully");
            navigate('/guest/order');
        }
        catch (error) {
            toast.error("Failed to checkout");
        }
    };

    const total = items.reduce((sum, item) => sum + Number(item.line_total ?? item.price * item.quantity), 0);

    return (
    <>
        <header>
            <h1>Welcome to the Food Ordering Application</h1>
            
            <button className="niceBtn" onClick={() => setShowAccountPopUp(true)}>
                Account
            </button>
        </header>

        <main>
            <h2>Your Cart</h2>
            <button className="niceBtn" onClick={() => navigate("/guest/menu")}>
                Back to Menu
            </button>

            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Line Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {items.length > 0 ? (
                    items.map((item) => (
                        <tr key={`${item.menu_item_id}-${item.id}`}>
                            <td>{item.item_name}</td>
                            <td>${Number(item.price).toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>${Number(item.line_total ?? item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button className="niceBtn" onClick={() => handleRemoveItem(item.menu_item_id)}>
                                    Remove
                                </button>
                                <button className="niceBtn" onClick={() => handleEditItem(item.menu_item_id)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                            No orders yet. Click "Add to Cart" to create one.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <h2>Total: ${total.toFixed(2)}</h2>
            <button
                className="niceBtn"
                onClick={handleClearCart}
            >Clear Cart
            </button>
            <button
                className="niceBtn"
                onClick={handleCheckout}
                disabled={items.length === 0}
            >Checkout
            </button>

            {showAccountPopUp && <AccountPopUp onClose={() => setShowAccountPopUp(false)} />}

            {editingItem && (
                <div className='modal-overlay' onClick={() => setEditingItem(null)}>
                    <div className='modal' onClick={e => e.stopPropagation()}>
                        <h2>Edit Quantity</h2>
                        <p><strong>Item:</strong> {editingItem.item_name}</p>
                        <p><strong>Price:</strong> ${Number(editingItem.price).toFixed(2)}</p>
                        <p><strong>Line Total:</strong> ${(Number(editingItem.price) * newQuantity).toFixed(2)}</p>
                        
                        <div className="form-input">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="0"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <button className="niceBtn" onClick={handleSaveQuantity}>
                            Save
                        </button>
                        <button className="niceBtn" onClick={() => setEditingItem(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </main>
    </>
    );
}