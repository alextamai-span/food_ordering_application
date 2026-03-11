import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { AccountFormData } from "../types/accountTypes";
import { fetchUserData } from '../services/empService';
import { deleteAccountService, editAccountService } from '../services/accountService';
import { useAccountValidation } from "../hooks/accountValidation";

// be able to close the pop-up by clicking outside of it
// have a close button inside the pop-up as well
interface AccountPopUpProps {
    onClose: () => void;
}

const AccountPopUp: React.FC<AccountPopUpProps> = ({
    // onClose is a function that will be called when the user clicks outside the pop-up or clicks the close button
    onClose 
}) => {
    const navigate = useNavigate();
    // Get token and id from Redux store using custom useAuth hook
    // Also get logout function to clear auth state on logout
    const { token, id, logout } = useAuth();

    // Local state for form data and validation errors
    const [editAccountData, setEditAccountData] = useState<AccountFormData>({
        name: "",
        email: "",
        account_type: ""
    });
    const [errors, setErrors] = useState<AccountFormData>({
        name: "",
        email: "",
        account_type: ""
    });

    // hook to validate account form data, returns true if there are errors, false if valid
    const { validateAccountForm } = useAccountValidation(editAccountData, setErrors);

    // Redirect if no token
    useEffect(() => {
        // checks if there is a token
        if (!token) {
            // no token, navigate to login page
            navigate('/login');
        }
    }, 
        // dependencies array for useEffect
        // what the useEffect needs/depends on to run
        [token, navigate]
    );

    // fetch user data to allow for editing and deleting account information
    useEffect(() => {
        // checks if there is token and id from the redux store
        if (token && id !== 0) {
            // function for fetching user data
            const loadUserData = async () => {
                try {
                    // fetch user data
                    // need the token and id from the redux store
                    const data = await fetchUserData(token, id);
                    // set the user data to local state for editing
                    setEditAccountData(data[0]);
                }
                catch (err: any) {
                    // error fetching user data, show error message
                    toast.error("Failed to fetch user data.")
                }
            };
            // call the function to load user data
            loadUserData();
        }}, 
        // dependencies array for useEffect
        // what the useEffect needs/depends on to run
        [token, id]
    );

    // handle logout button click
    const handleLogout = () => {
        logout(); // Clear Redux auth state
        navigate('/login'); // Redirect to login page
    }

    // handle delete account button click
    const handleDelete = async () => {
        try {
            // call delete account service with token and id from redux store
            const deleteAccount = await deleteAccountService(token, id);

            // checks the response to see if the account was successfully deleted
            if (deleteAccount.success) {
                // account deleted successfully
                toast.success("Account deleted");
                logout(); // Clear Redux auth state
                navigate('/register'); // Redirect to register page 
            }
            else {
                // error deleting account, show error message
                toast.error(deleteAccount.message || "Failed to delete account");
            }
        }
        catch (err: any) {
            // error deleting account, show error message
            toast.error("Failed to delete account.");
        }
    }

    // handle edit account button click
    const handleEdit = async () => {
        // validate the edit account form: name and email
        const hasErrors = validateAccountForm();

        // checks if there are any errors
        if (hasErrors) {
            // there are errors in the form, show error message
            toast.error("Please fix the errors in the form.");
            // cancel the edit request
            return;
        }

        // there are no errors
        try {
            // call edit account service with token, id, and edit account data from local state
            const editAccount = await editAccountService(token, id, editAccountData);

            // checks the response to see if the account was successfully edited
            if (editAccount.success) {
                // account edited successfully, show success message
                toast.success("Account updated successfully");
            }
            else {
                // error editing account, show error message
                toast.error(editAccount.message || "Failed to edit account");
            }
        }
        catch (err: any) {
            // error editing account, show error message
            toast.error("Failed to edit account.");
        }
    }

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

    // handle any input changes for the edit account form
    const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // get the name and value of the input 
        const { name, value } = e.target;
        
        // update the local state for allow for editing account information
        setEditAccountData((prev) => ({
            // spread operator to keep the previous state and only update the specific field that changed
            ...prev,
            // use the cleanTextInput function to remove spaces from the input value before updating the state
            [name]: cleanTextInput(value),
        }));
    };
    
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                {/* close button */}
                <button className="niceBtn" onClick={onClose}>
                    Close
                </button>
                {/* pop up header */}
                <h2>Account {editAccountData.account_type.toUpperCase()} Information</h2>

                {/* editing the name */}
                <label>Name:   </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editAccountData.name}
                    onChange={handleAccountInputChange}
                />
                {/* error message for name */}
                {errors.name && <p className="error">{errors.name}</p>}

                <br></br>
                <br></br>

                {/* editing the email */}
                <label>Email:   </label>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={editAccountData.email}
                    onChange={handleAccountInputChange}
                />
                {/* error message for email */}
                {errors.email && <p className="error">{errors.email}</p>}

                <br></br>
                
                {/* logout button, handleLogout will log the user out of their account */}
                <button className="niceBtn" onClick={handleLogout}>
                    Logout
                </button>

                {/* delete account button, handleDelete will delete the user's account */}
                <button className="niceBtn" onClick={handleDelete}>
                    Delete Account
                </button>

                {/* edit account button, handleEdit will see if the edit was successful(apply changes) or not(say what's wrong) */}
                <button className="niceBtn" onClick={handleEdit}>
                    Save Edit Account
                </button>
            </div>
        </div>
    );
}

export default AccountPopUp;