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
      id: result.id ?? result.accountId,
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
      id: result.id ?? result.accountId,
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

export const deleteAccountService = async (token: string, id: number): Promise<ServiceResponse> => {
  try {
    const response = await fetch(`http://localhost:5000/account/delete_account${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        return { success: false, message: "Invalid input data" };
      }

      if (response.status === 401) {
        return { success: false, message: "Unauthorized: Invalid credentials" };
      }

      return { success: false, message: "Server error" };
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || "Account deleted successfully!",
    };
  }
  catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
};

export const editAccountService = async (token: string, id: number, updatedData: Partial<AccountFormData>): Promise<ServiceResponse> => {
  try {
    const response = await fetch(`http://localhost:5000/account/update_account${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return { success: false, message: "Invalid input data" };
      }
      if (response.status === 401) {
        return { success: false, message: "Unauthorized: Invalid credentials" };
      }
      return { success: false, message: "Server error" };
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || "Account updated successfully!",
      data: result.data,
    };
  }
  catch (error) {
    console.error("Error editing account:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
};