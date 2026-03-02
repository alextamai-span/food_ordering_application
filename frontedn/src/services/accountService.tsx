import { AccountFormData, ServiceResponse } from "../types/accountTypes";

export const saveNewAccount = async (
  newData: AccountFormData
): Promise<ServiceResponse> => {
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error('Failed to add new guest account.');
    }

    // get result from the response
    const result = await response.json();
    return {
      success: true,
      message: result.message || "Account created successfully!",
      data: result.data,
    };
  }
  catch (error) {
    console.error("Error saving account:", error);
    return { 
      success: false, 
      message: "Network error or server unreachable."
    };
  }
};

export const validateLogin = async (
  loginData: Pick<AccountFormData, "email" | "password">
): Promise<ServiceResponse> => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Failed to login. Please check your credentials.');
    }

    // get result from the response
    const result = await response.json();
    return {
      success: true,
      message: result.message || "Login successful!",
      data: result.account_type,
    };
  }
  catch (error) {
    console.error("Error validating login:", error);
    return {
      success: false,
      message: "Network error or server unreachable."
    };
  }
};