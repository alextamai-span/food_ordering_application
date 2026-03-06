import { CartItem } from "../types/cartTypes";

// Get all cart items for the currently logged-in user
export const fetchGuestCart = async (token: string): Promise<CartItem[]> => {
  const response = await fetch(`http://localhost:5000/cart/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch cart");
  return response.json();
};

// Add one menu item to cart (or increase quantity if item already exists)
export const addItemToCart = async (
  token: string,
  menu_item_id: number,
  quantity = 1
) => {
  const response = await fetch(`http://localhost:5000/cart/add_item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ menu_item_id, quantity }),
  });

  if (!response.ok) throw new Error("Failed to add to cart");
  return response.json();
};

// Update quantity for an item already in the cart
export const updateCartItemQty = async (
  token: string,
  menu_item_id: number,
  quantity: number
) => {
  const response = await fetch(`http://localhost:5000/cart/update_quantity${menu_item_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) throw new Error("Failed to update quantity");
  return response.json();
};

// Remove a single item from cart using hard delete (HTTP DELETE)
// using DELETE method to ensure the item is fully removed from the cart
// do not want to use a soft delete here because we want the item to be fully removed 
export const removeCartItem = async (token: string, menuItemId: number) => {
  const response = await fetch(
    `http://localhost:5000/cart/remove_item${menuItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to remove item");
  return response.json();
};

// Clear all items from the current user's cart using hard delete (HTTP DELETE)
// using DELETE method to ensure the item is fully removed from the cart
// do not want to use a soft delete here because we want the item to be fully removed 
export const clearCart = async (token: string) => {
  const response = await fetch(`http://localhost:5000/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to clear cart");
  return response.json();
};

// After checkout, update menu item on the items purchased
export const afterCheckoutMenu = async (token: string, menuItemId: number, quantity: number) => {
  const response = await fetch(`http://localhost:5000/cart/after_checkout_menu`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ menuItemId, quantity }),
  });

  if (!response.ok) throw new Error("Failed to update menu after checkout");
  return response.json();
};