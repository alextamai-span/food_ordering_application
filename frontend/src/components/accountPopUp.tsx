import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { AccountFormData } from "../types/accountTypes";
import { fetchUserData } from '../services/empService';
import { deleteAccountService, editAccountService } from '../services/accountService';
import { useAccountValidation } from "../hooks/accountValidation";

interface AccountPopUpProps {
    onClose: () => void;
}

const AccountPopUp: React.FC<AccountPopUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const { token, id, logout } = useAuth();

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

    const { validateAccountForm } = useAccountValidation(editAccountData, setErrors);

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
            if (token && id !== 0) {
                const loadUserData = async () => {
                    try {
                        const data = await fetchUserData(token, id);
                        setEditAccountData(data[0]);
                    }
                    catch (err: any) {
                        toast.error("Failed to fetch user data.")
                    }
                };
                loadUserData();
            }
        }, [token, id]
    );

    const handleLogout = () => {
        logout(); // Clear Redux auth state
        navigate('/login'); // Redirect to login page
    }

    const handleDelete = async () => {
        try {
            const deleteAccount = await deleteAccountService(token, id);

            if (deleteAccount.success) {
                toast.success("Account deleted");
                logout();
                navigate('/register');
            }
            else {
                toast.error(deleteAccount.message || "Failed to delete account");
            }
        }
        catch (err: any) {
            toast.error("Failed to delete account.");
        }
    }

    const handleEdit = async () => {
        const hasErrors = validateAccountForm();
        if (hasErrors) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            const editAccount = await editAccountService(token, id, editAccountData);
            console.log("Edit account response:", editAccount);

            if (editAccount.success && editAccount.data) {
                toast.success("Account updated successfully");

                if (editAccountData.account_type === "guest") {
                    navigate("/guest/menu");
                }
                else if (editAccountData.account_type === "employee") {
                    navigate("/emp/menu");
                }
            }
            else {
                toast.error(editAccount.message || "Failed to edit account");
            }
        }
        catch (err: any) {
            toast.error("Failed to edit account.");
        }
    }

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <button className="niceBtn" onClick={onClose}>
                    Close
                </button>
                <h2>Account Information</h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={editAccountData.name}
                    onChange={e => setEditAccountData({ ...editAccountData, name: e.target.value })}
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    value={editAccountData.email}
                    onChange={e => setEditAccountData({ ...editAccountData, email: e.target.value })}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <select
                    value={editAccountData.account_type}
                    onChange={e => setEditAccountData({ ...editAccountData, account_type: e.target.value })}
                >
                    <option value="">Select Account Type</option>
                    <option value="guest">Guest</option>
                    <option value="employee">Employee</option>
                </select>
                {errors.account_type && <p className="error">{errors.account_type}</p>}

                <button className="niceBtn" onClick={handleLogout}>
                    Logout
                </button>

                <button className="niceBtn" onClick={handleDelete}>
                    Delete Account
                </button>

                <button className="niceBtn" onClick={handleEdit}>
                    Edit Account
                </button>
            </div>
        </div>
    );
}

export default AccountPopUp;