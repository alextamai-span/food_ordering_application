import React, { useEffect, useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterValidation } from "../hooks/registerValidation";
import { saveNewAccount } from "../services/accountService";
import { useAuth } from "../hooks/useAuth";

export default function AccountRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
  const { validateRegisterForm } = useRegisterValidation(formData, setErrors);

  // handle input change
  useEffect(() => {
    if (hasSubmitted) {
      validateRegisterForm();
    }
  }, [formData, hasSubmitted, validateRegisterForm]);

  // removes leading/trailing spaces and collapses multiple spaces into one
  const cleanTextInput = (value: string) => {
    return value.replace(/\s+/g, ' ').trimStart();
  };

  // Handle form submission
  const handleAccountRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const hasErrors = validateRegisterForm();
    if (hasErrors) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    else {
        try {
            const result = await saveNewAccount(formData);

            if (result.success) {
                toast.success("Account created successfully!");
                
                // Store in Redux
                login(
                  result.token || '',
                  result.id || 0,
                  result.data || ''
                );

                if(result.data === "employee") {
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
                setHasSubmitted(false);
            }
            else {
                toast.error(result.message || "Failed to create account.");
            }
        } catch (error) {
            toast.error("An error occurred while creating the account.");
        }
    }

  };

  return (
    <>
        <header>
            <h1>Welcome to the Food Ordering Application</h1>
        </header>

        <main>
            <h3>Create a new account</h3>

            <form id='account-register-form' onSubmit={handleAccountRegister}>
                <div className="form-input">
                    <label htmlFor="name">Name   </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: cleanTextInput(e.target.value) })}
                    />
                </div>
                { errors.name && <p className="form-invalid">{errors.name}</p> }

                <div className="form-input">
                    <label htmlFor="email">Email   </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: cleanTextInput(e.target.value) })}
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
                        onChange={(e) => setFormData({ ...formData, password: cleanTextInput(e.target.value) })}
                    />
                </div>
                { errors.password && <p className="form-invalid">{errors.password}</p> }

                <div className="form-input">
                    <label htmlFor="account_type">Account Type   </label>
                    <select
                        id="account_type"
                        name="account_type"
                        value={formData.account_type}
                        onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                    >
                      <option value="">Select Account Type</option>
                      <option value="guest">Guest</option>
                      <option value="employee">Employee</option>
                    </select>
                </div>
                { errors.account_type && <p className="form-invalid">{errors.account_type}</p> }
            </form>

            <button
              className="niceBtn"
              type="submit"
              form="account-register-form"
            >Create Account</button>

            <p>Already have an account?
                <Link to="/login">Login here</Link></p>
        </main>
    </>
  );
};