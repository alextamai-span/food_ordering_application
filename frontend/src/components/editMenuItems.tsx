import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { ItemTypes, ItemErrors } from '../types/menuItemTypes';
import { addItemValidator } from '../hooks/addItemValidator';
import { editItemInMenu } from '../services/empService'

interface EditItemProps {
    item: ItemTypes;
    onClose: () => void;
    onItemUpdated: (item: ItemTypes) => void;
    token: string;
};

const EditItemPopUp: React.FC<EditItemProps> = ({
    item, 
    onClose,
    onItemUpdated,
    token
}) => {
    const [editItemData, setEditItemData] = useState<ItemTypes>({
        id: item.id,
        item_name: item.item_name,
        price: item.price,
        quantity: item.quantity,
        available: item.available
    });

    const [errors, setErrors] = useState<ItemErrors>({
        id: "",
        item_name: "",
        price: "",
        quantity: "",
        available: ""
    });

    const { validateAddItem } = addItemValidator(editItemData, setErrors);

    // removes leading/trailing spaces and collapses multiple spaces into one
    const cleanTextInput = (value: string) => {
        return value.replace(/\s+/g, ' ').trimStart();
    };

    // submit for edit an item
    const handleSubmit = async (e: any) =>{
        e.preventDefault();
    
        const hasError = validateAddItem();
  
        if(!hasError) {
            try {
                const editItem = await editItemInMenu(editItemData, token);
         
                if (editItem.success && editItem.data) {
                    onItemUpdated(editItem.data);
                    onClose();
                }
                else {
                    toast.error("Failed to edit item");
                }
            }
            catch {
                toast.error("Failed to edit item");
            }
        }
        else {
            toast.error("Please fix the errors in the form.");
        }
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <h2>Edit Item in Menu</h2>

                <form id="edit-item-form" onSubmit={handleSubmit}>
                    <label>Item Name:</label>
                    <input
                        type='text'
                        name='item_name'
                        value={editItemData.item_name}
                        onChange={(e) => setEditItemData(prev => ({ ...prev, item_name: cleanTextInput(e.target.value) }))}
                    />
                    { errors.item_name && (
                        <h4 className='form-invalid'>
                            {errors.item_name}
                        </h4>
                    )}

                    <label>Price:</label>
                    <input 
                        type='number'
                        name='price'
                        step={0.01}
                        value={editItemData.price}
                        onChange={(e) => setEditItemData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
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
                        value={editItemData.quantity}
                        onChange={(e) => setEditItemData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
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
                            value='true'
                            checked={editItemData.available === true}
                            onChange={() => setEditItemData(prev => ({ ...prev, available: true }))}
                        />
                        <label>Yes</label>
                    </div>
                    <div className='radio-group'>
                        <input
                            type='radio'
                            name='available'
                            value='false'
                            checked={editItemData.available === false}
                            onChange={() => setEditItemData(prev => ({ ...prev, available: false }))}
                        />
                        <label>No</label>
                    </div>
                    { errors.available && (
                        <h4 className='form-invalid'>
                            {errors.available}
                        </h4>
                    )}
                </form>

                <button type="submit" className="niceBtn" form="edit-item-form">
                    Save
                </button>
                    
                <button type="button" className="niceBtn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditItemPopUp;