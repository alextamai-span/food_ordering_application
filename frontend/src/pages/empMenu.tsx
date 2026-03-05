import '../App.css'
import React, { useEffect, useState } from "react";
import { ItemTypes } from "../types/menuItemTypes";
import { toast } from "react-toastify/unstyled";
import { useNavigate } from "react-router-dom";
import { fetchEmpMenu, deleteItem } from '../services/empService';
import { useAuth } from '../hooks/useAuth';

import AddItemPopUp from '../components/addMenuItem';
import EditItemPopUp from '../components/editMenuItems';

export default function EmpMenu() {
    const navigate = useNavigate();
    const { token } = useAuth();

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const [items, setItems] = useState<ItemTypes[]>([]);
    const [showAddItemPopUp, setShowAddItemPopUp] = useState(false);
    const [showEditItemPopUp, setshowEditItemPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemTypes | null>(null);

    useEffect(() => {
        if (token) {
            const loadMenu = async () => {
                try {
                    const empMenu = await fetchEmpMenu(token);
                    setItems(empMenu);
                }
                catch (err: any) {
                    toast.error("Failed to load menu.")
                }
            };
            loadMenu();
        }
    }, [token]);

    // new menu item has been added
    const handleNewItem = async () => {
        try {
            // get most recent list 
            const data = await fetchEmpMenu(token);
            setItems(data);
            setShowAddItemPopUp(false);
        }
        catch(err: any) {
            toast.error('Item added, but the menu failed to re-render');
        }
    };

    // delete an employee
    const handleDelete = async (id: number) => {
        try {
            await deleteItem(id, token);
            const empMenu = await fetchEmpMenu(token);
            setItems(empMenu);
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
            </header>

            <main>
                <h2>Employee Menu</h2>
                
                <button
                    className="niceBtn"
                    onClick={() => setShowAddItemPopUp(true)}
                > Add Item  
                </button>
                { showAddItemPopUp && (
                    <AddItemPopUp
                        token={token}
                        onClose={() => setShowAddItemPopUp(false)}
                        onNewItemAdded={handleNewItem}
                    />
                )}
                
                <button className="niceBtn">View Orders</button>

                <table>
                    {/* header row */}
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Actions</th> 
                    </tr>
                    </thead>
                    
                    {/* data rows */}
                    <tbody>
                    { items.length > 0 ? (
                        items.map((item, index) => (
                        <tr key={item.id || `item-${index}`}>
                            <td>{item.item_name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.available ? 'Yes' : 'No'}</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setshowEditItemPopUp(true);
                                    }}
                                >
                                    <img src="/edit.png" alt="Edit" />
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <img src="/trash.png" alt="Delete" />
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}>
                                No items yet. Click "Add Item" to create one.
                            </td>
                        </tr>

                    )}
                    </tbody>
                </table>
            </main>

            { 
                showEditItemPopUp &&
                selectedItem && 
                ( <EditItemPopUp
                    item={selectedItem}
                    token={token}
                    onClose={async () => {
                        setshowEditItemPopUp(false);
                        setSelectedItem(null);
                        const empMenu = await fetchEmpMenu(token);
                        setItems(empMenu);
                    }}
                    onItemUpdated={(updatedItem: ItemTypes) => 
                        setItems(prev => prev.map(
                            item => item.id === updatedItem.id ? updatedItem : item
                        ))
                    }
                    />
                )
            }
        </>
    );
}