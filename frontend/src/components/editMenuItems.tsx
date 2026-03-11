import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { ItemTypes, ItemErrors } from '../types/menuItemTypes';
import { addItemValidator } from '../hooks/addItemValidator';
import { editItemInMenu } from '../services/empService'

// props for the edit item pop up component
interface EditItemProps {
    // item that will be edited
    item: ItemTypes;
    // closes the pop up
    onClose: () => void;
    // function to update the menu that passes the edited item
    onItemUpdated: (item: ItemTypes) => void;
    // token for authentication
    token: string;
};

// pop up for editing an item in the menu
const EditItemPopUp: React.FC<EditItemProps> = ({
    item, 
    onClose,
    onItemUpdated,
    token
}) => {
    // state for the edited item data and form errors
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

    // hook to validate account form data, returns true if there are errors, false if valid
    const { validateAddItem } = addItemValidator(editItemData, setErrors);

    // remove spaces
    const cleanTextInput = (value: string) => {
        // replace any spaces
        return value.replace(/\s+/g, '');
        // could add these methods for more specific trimming 
        // | Method      | Removes                |
        // | ----------- | ---------------------- |
        // | trimStart() | beginning only         |
        // | trimEnd()   | end only               |
        // | trim()      | both beginning and end |
    };

    // handle the input change for the add item form
        const handleMenuInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // get the name, value, and type from the input event
            const { name, value, type } = e.target;
            
            // update the local state for adding a new item
            setEditItemData((prev) => {
                // if the input is a number type
                if (type === "number") {
                    return {
                        // return the new data
                        ...prev,
                        // return the price as a float(price) or int(quantity)
                        [name]: name === "price" ? parseFloat(value) || 0 : parseInt(value) || 0,
                    };
                }
            
                // if the input is a radio type and name is available
                if (type === "radio" && name === "available") {
                    return {
                        // return the new data
                        ...prev,
                        // return true if yes is selected
                        // return false if no is selected
                        available: value === "true",
                    };
                }
            
                // any other input type (text)
                return {
                    // return the new data
                    ...prev,
                    // return the cleaned text input
                    [name]: cleanTextInput(value),
                };
            });
        };

    // submit for edit an item
    const handleSubmit = async (e: any) =>{
        // prevent auto refresh on sumbit
        e.preventDefault();
    
        // validate the edit form
        const hasError = validateAddItem();
  
        // checks if there are no errors
        if(!hasError) {
            try {
                // call the edit item service with the edited item data
                // need to check and validate the token 
                const editItem = await editItemInMenu(editItemData, token);
         
                // checks the response to see if the item was successfully updated 
                if (editItem.success && editItem.data) {
                    // item updated successfully, show success message
                    toast.success("Item successfully edited");
                    // update the menu with the updated item
                    onItemUpdated(editItem.data);
                    // close the pop up
                    onClose();
                }
                else {
                    // item failed to update, show error message
                    toast.error("Failed to edit item");
                }
            }
            catch {
                // error with the request, show error message
                toast.error("Failed to edit item");
            }
        }
        else {
            // there are validation errors, show error message
            toast.error("Please fix the errors in the form.");
        }
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                {/* close button */}
                <button className="niceBtn" onClick={onClose}>
                    Close
                </button>
                {/* header for the edit item pop up */}
                <h2>Edit Item in Menu</h2>

                <form onSubmit={handleSubmit}>
                    {/* input field for item name */}
                    <label>Item Name:</label>
                    <input
                        type='text'
                        name='item_name'
                        value={editItemData.item_name}
                        onChange={handleMenuInputChange}
                    />
                    {/* error handler for item name validation */}
                    { errors.item_name && (
                        <h4 className='form-invalid'>
                            {errors.item_name}
                        </h4>
                    )}

                    {/* input field for item price */}
                    <label>Price:</label>
                    <input 
                        type='number'
                        name='price'
                        step={0.01}
                        value={editItemData.price}
                        onChange={handleMenuInputChange}
                    />
                    {/* error handler for price validation */}
                    { errors.price && (
                        <h4 className='form-invalid'>
                            {errors.price}
                        </h4>
                    )}

                    {/* input field for item quantity */}
                    <label>Quantity:</label>
                    <input 
                        type='number'
                        name='quantity'
                        value={editItemData.quantity}
                        onChange={handleMenuInputChange}
                    />
                    {/* error handler for quantity validation */}
                    { errors.quantity && (
                        <h4 className='form-invalid'>
                            {errors.quantity}
                        </h4>
                    )}

                    {/* section for item availability */}
                    <p>Is this item available?</p>
                    <div className='radio-group'>
                        {/* input field for item availability, value is true for yes */}
                        <input
                            type='radio'
                            name='available'
                            value='true'
                            checked={editItemData.available === true}
                            onChange={handleMenuInputChange}
                        />
                        <label>Yes</label>
                    </div>
                    <div className='radio-group'>
                        {/* input field for item availability, value is false for no */}
                        <input
                            type='radio'
                            name='available'
                            value='false'
                            checked={editItemData.available === false}
                            onChange={handleMenuInputChange}
                        />
                        <label>No</label>
                    </div>
                    {/* error handler for availability validation */}
                    { errors.available && (
                        <h4 className='form-invalid'>
                            {errors.available}
                        </h4>
                    )}
                </form>

                {/* submit button to save the edited item, handleSubmit will see if the edit was successful or not */}
                <button type="submit" className="niceBtn" onClick={handleSubmit}>
                    Save
                </button>
                
                {/* cancel button to close the pop up */}
                <button type="button" className="niceBtn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditItemPopUp;