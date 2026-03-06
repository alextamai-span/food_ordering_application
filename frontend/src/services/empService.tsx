import { ItemTypes } from "../types/menuItemTypes";
import { AccountFormData, ServiceResponse } from "../types/accountTypes";

export const fetchEmpMenu = async (token: string): Promise<ItemTypes[]> => {
  try {
    const response = await fetch(`http://localhost:5000/emp/menu/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error("Failed to fetch Employee Menu");
    }

    const result = await response.json();
    return result;
  }
  catch (err: any) {
    console.error('Error getting the menu items: ', err);
    throw err;
  }
};

export const deleteItem = async (id: number, token: string): Promise<ServiceResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/menu/delete_item${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(id),
        });

        if (!response.ok) {
            throw new Error("Failed to delete Menu Item");
        }

        const result = await response.json();
        return {
            success: true,
            message: 'Item deleted successfully',
            data: result
        }
    }
    catch (err: any) {
        console.error("Failed to delete item:", err);
        return {
            success: false,
            message: 'Fail'
        }
    }
};

export const addItemToMenu = async (addItemData: ItemTypes, token: string): Promise<ServiceResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/menu/add_item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(addItemData)
        });

        if (response.status === 409) {
            return {
                success: false,
                message: 'Item name already exists. Please use a different name.'
            };
        }
        if(!response.ok) {
            throw new Error('Failed to add new item to menu.');
        }

        const newItem = await response.json();

        return {
            success: true,
            message: "Item successfully added to menu.",
            data: newItem
        };
    }
    catch (err: any) {
        console.log('Failed to add item to menu: ', err);

        return {
            success: false,
            message: 'Item failed to add to menu'
        };
    }
};

export const editItemInMenu = async (
    editItemData: ItemTypes,
    token: string
): Promise<ServiceResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/emp/menu/update_item${editItemData.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(editItemData),
        });

        if(!response.ok) {
            throw new Error('Failed to update the item in menu');
        }

        const result = await response.json();
        return {
            success: true,
            message: 'Item successfully updated',
            data: result
        };
    }
    catch (err: any) {
        console.error('Failed to update item in menun: ', err);
        return {
            success: false,
            message: 'Failed to update item in menu'
        };
    }
};

export const fetchUserData = async (token: string, id: number): Promise<AccountFormData[]> => {
  try {
    const response = await fetch(`http://localhost:5000/emp/menu/account${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    const result = await response.json();
    return result;
  }
  catch (err: any) {
    console.error('Error getting the user data: ', err);
    throw err;
  }
};