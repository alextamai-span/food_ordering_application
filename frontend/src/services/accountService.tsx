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
      if (response.status === 409) {
        return { success: false, message: "User already exists" };
      }

      if (response.status === 400) {
        return { success: false, message: "Invalid input data" };
      }

      return { success: false, message: "Server error" };
    }

    // get result from the response
    const result = await response.json();

    return {
      success: true,
      message: result.message || "Account created successfully!",
      token: result.token,
      data: result.account_type,
    };
  }
  catch (error) {
    console.error("Error saving account:", error);
    return { 
      success: false, 
      message: "Something wrong. Please try again."
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
      message: result.message,
      token: result.token,
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