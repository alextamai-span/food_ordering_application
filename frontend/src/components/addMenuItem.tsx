import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { ItemTypes, ItemErrors } from '../types/menuItemTypes';
import { addItemValidator } from '../hooks/addItemValidator';
import { addItemToMenu } from '../services/empService'

interface AddItemProps {
    onClose: () => void;
    token: string;
    onNewItemAdded: (item: ItemTypes) => void;
};

const addItemPopUp: React.FC<AddItemProps> = ({
    onClose,
    token,
    onNewItemAdded
}) => {
    const [newItemData, setNewItemData] = useState<ItemTypes>({
        id: "",
        item_name: "",
        price: 0.00,
        quantity: 0,
        available: true
    });

    const [errors, setErrors] = useState<ItemErrors>({
        id: "",
        item_name: "",
        price: "",
        quantity: "",
        available: ""
    });

    const { validateAddItem } = addItemValidator(newItemData, setErrors);

    // submit for a new item
    const handleSubmit = async (e: any) =>{
        e.preventDefault();

        const hasError = validateAddItem();

        if(!hasError) {
            try {
                const addItemData = {...newItemData};
                const newItem = await addItemToMenu(addItemData, token);
        
                if (newItem.success && newItem.data) {
                    onNewItemAdded(newItem.data);
                    onClose();
                }
                else {
                    toast.error("Failed to add new item");
                }
            }
            catch {
                toast.error("Failed to add new item");
            }
        }
        else {
            toast.error("Please fix the errors in the form.");
        }
    };


    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <h2>Add Item to Menu</h2>

                <form onSubmit={handleSubmit}>
                    <label>Item Name:</label>
                    <input
                        type='text'
                        name='item_name'
                        value={newItemData.item_name}
                        onChange={(e) => setNewItemData(prev => ({ ...prev, item_name: e.target.value }))}
                    />
                    { errors.item_name && (
                        <h4 className='form-invalid'>
                            {errors.item_name}
                        </h4>
                    )}

                    <label>Price:</label>
                    <input 
                        type='number'
                        step={0.01}
                        name='price'
                        value={newItemData.price}
                        onChange={(e) => setNewItemData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                    { errors.price && (
                        <h4 className='form-invalid'>
                            {errors.price}
                        </h4>
                    )}

                    <label>Quantity:</label>
                    <input 
                        type='number'
                        name='quantity'
                        value={newItemData.quantity}
                        onChange={(e) => setNewItemData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    />
                    { errors.quantity && (
                        <h4 className='form-invalid'>
                            {errors.quantity}
                        </h4>
                    )}

                    <p>Is this item available?</p>
                    <div className='radio-group'>
                        <input
                            type='radio'
                            name='available'
                            className='rabioBtn'
                            value='true'
                            checked={newItemData.available === true}
                            onChange={() => setNewItemData(prev => ({ ...prev, available: true }))}
                        />
                        <label>Yes</label>
                    </div>
                    <div className='radio-group'>
                        <input
                            type='radio'
                            name='available'
                            className='rabioBtn'
                            value='false'
                            checked={newItemData.available === false}
                            onChange={() => setNewItemData(prev => ({ ...prev, available: false }))}
                        />
                        <label>No</label>
                    </div>
                    { errors.available && (
                        <h4 className='form-invalid'>
                            {errors.available}
                        </h4>
                    )}
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
}

export default addItemPopUp;