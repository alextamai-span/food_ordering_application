import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { AccountFormData } from "../types/accountTypes";
import { fetchUserData } from '../services/empService';

interface AccountPopUpProps {
    onClose: () => void;
}

const AccountPopUp: React.FC<AccountPopUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const { token, id, logout } = useAuth();
    const [userData, setUserData] = useState<AccountFormData | null>(null);

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
                        setUserData(data[0]);
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

    const handleDelete = () => {
        // if i had more time
        //   - would add a delete account endpoint in the backend
        //   - would call that endpoint here to soft delete the account from the database
        logout();
        navigate('/login');
    }


    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <button className="niceBtn" onClick={onClose}>
                    Close
                </button>
                <h2>Account Information</h2>

                <p><strong>Name:</strong> {userData?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {userData?.email || 'N/A'}</p>
                <p><strong>Account Type:</strong> {userData?.account_type || 'N/A'}</p>

                <button className="niceBtn" onClick={handleLogout}>
                    Logout
                </button>

                <button className="niceBtn" onClick={handleDelete}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default AccountPopUp;