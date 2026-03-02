import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginValidation } from "../hooks/loginValidation";
import { validateLogin } from "../services/accountService";

export default function AccountLogin() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    account_type: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    account_type: "",
  });

  // Validation check
  const { validateLoginForm } = useLoginValidation(formData, setErrors);

  // Handle form submission
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = validateLoginForm();
    if (hasErrors) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    else {
        try {
            const result = await validateLogin(formData);
            if (result.success) {
                toast.success("Login successful!");

                if(result.data === "employer") {
                    navigate("/emp/menu");
                }
                else {
                    navigate("/guest/menu");
                }

                // reset form data
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    account_type: "",
                });
            }
            else {
                toast.error(result.message || "Failed to login.");
            }
        } catch (error) {
            toast.error("An error occurred while logging in.");
        }
    }

  };

  return (
    <>
        <header>
            <h1>Welcome to the Food Ordering Application</h1>
        </header>

        <main>
            <h3>Login to your account</h3>

            <form id='account-login-form' onSubmit={handleAccountLogin}>
                    <div className="form-input">
                    <label htmlFor="email">Email   </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                { errors.email && <p className="form-invalid">{errors.email}</p> }

                <div className="form-input">
                    <label htmlFor="password">Password   </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                { errors.password && <p className="form-invalid">{errors.password}</p> }
            </form>

            <button
              className="niceBtn"
              type="submit"
              form="account-login-form"
            >Login</button>

            <p>Do not have an account?   
                <Link to="/register">Register here</Link></p>
        </main>
    </>
  );
};