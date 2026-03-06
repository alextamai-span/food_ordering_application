import { ItemTypes } from "../types/menuItemTypes";

// fetch guest menu items
export const fetchGuestMenu = async (token: string): Promise<Pick<ItemTypes, 'id' | 'item_name' | 'price'>[]> => {
  try {
    const response = await fetch(`http://localhost:5000/guest/menu/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error("Failed to fetch Guest Menu");
    }

    const result = await response.json();
    return result;
  }
  catch (err: any) {
    console.error('Error getting the menu items: ', err);
    throw err;
  }
};