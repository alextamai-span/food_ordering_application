import '../App.css'
import React, { useState } from "react";
import { ItemTypes } from "../types/menuItemTypes";
import { toast } from "react-toastify/unstyled";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmpMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    // const token = location.state.token;


    const [items, setItems] = useState<ItemTypes[]>([]);
    const [showAddItemPopUp, setShowAddItemPopUp] = useState(false);
    const [showEditItemPopUp, setshowEditItemPopUp] = useState(false);
    const [showDeleteItemPopUp, setshowDeleteItemPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // delete an employee
    const handleDelete = async (id: string) => {
        try {
            //await deleteItem(id, token);
            setItems(prev => prev.filter((item: any) => item.id !== id));
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
                
                <button className="niceBtn">Add Item</button>
                <button className="niceBtn">View Orders</button>

                <table>
                    {/* header row */}
                    <thead>
                    <tr>
                        <th>Items</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Actions</th> 
                    </tr>
                    </thead>
                    
                    {/* data rows */}
                    <tbody>
                    { items.length > 0 ? (
                        items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.available}</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        // setSelectedItem(item);
                                        // setshowEditItemPopUp(true);
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
        </>
    );
}