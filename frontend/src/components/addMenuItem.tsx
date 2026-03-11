import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { ItemTypes, ItemErrors } from '../types/menuItemTypes';
import { addItemValidator } from '../hooks/addItemValidator';
import { addItemToMenu } from '../services/empService'

// props for the add item pop up component
interface AddItemProps {
    // function to close the pop up
    onClose: () => void;
    // token for authentication
    token: string;
    // function to update the menu that passes the new item
    onNewItemAdded: (item: ItemTypes) => void;
};

// pop up for adding a new item to the menu
const AddItemPopUp: React.FC<AddItemProps> = ({
    onClose,
    token,
    onNewItemAdded
}) => {
    // state for the new item data and form errors
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

    // hook to validate account form data, returns true if there are errors, false if valid
    const { validateAddItem } = addItemValidator(newItemData, setErrors);

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
        setNewItemData((prev) => {
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

    // handle submit for a new item to be added to the menu
    const handleSubmit = async (e: any) =>{
        // prevent auto refresh on submit
        e.preventDefault();

        // validate the add item form
        const hasError = validateAddItem();

        // checks if there are no errors
        if(!hasError) {
            try {
                // gets the new item data
                const addItemData = {...newItemData};
                // call service to add the new item to the menu
                // need to check and validate the token
                const newItem = await addItemToMenu(addItemData, token);
        
                // checks the response to see if the item was successfully added
                if (newItem.success && newItem.data) {
                    // item added successfully, show success message
                    toast.success("New item added successfully");
                    // update the menu with the new item
                    onNewItemAdded(newItem.data);
                    // close the pop up
                    onClose();
                }
                else {
                    // error adding item, show error message
                    toast.error(newItem.message || "Failed to add new item");
                }
            }
            catch {
                // error adding item, show error message
                toast.error("Failed to add new item");
            }
        }
        else {
            // error in form validation, show error message
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
                {/* pop up header */}
                <h2>Add Item to Menu</h2>

                <form onSubmit={handleSubmit}>
                    {/* input field for item name */}
                    <label>Item Name:</label>
                    <input
                        type='text'
                        name='item_name'
                        value={newItemData.item_name}
                        onChange={handleMenuInputChange}
                    />
                    {/* error handler for item name validation */}
                    { errors.item_name && (
                        <h4 className='form-invalid'>
                            {errors.item_name}
                        </h4>
                    )}

                    {/* input field for item name */}
                    <label>Price:</label>
                    <input 
                        type='number'
                        step={0.01}
                        name='price'
                        value={newItemData.price}
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
                        value={newItemData.quantity}
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
                            className='rabioBtn'
                            value='true'
                            checked={newItemData.available === true}
                            onChange={handleMenuInputChange}
                        />
                        <label>Yes</label>
                    </div>

                    <div className='radio-group'>
                        {/* input field for item availability, value is false for no */}
                        <input
                            type='radio'
                            name='available'
                            className='rabioBtn'
                            value='false'
                            checked={newItemData.available === false}
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

                {/* submit button to add the new item, handleSubmit will see if the add was successful or not */}
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

export default AddItemPopUp;