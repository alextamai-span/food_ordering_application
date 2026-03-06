import { FastifyInstance } from "fastify";
import {
  addToCartQuery,
  listCartItemsQuery,
  updateCartItemQuery,
  removeCartItemQuery,
  clearCartQuery,
  afterCheckoutMenuQuery
} from "../db/cartQueries";
import colors from 'console-log-colors'

export const CartRepository = (fastify: FastifyInstance) => ({
  // Add item to cart (or increase quantity if exists)
  async addItem(userId: number, menuItemId: number, quantity: number) {
    try {
      const { rows } = await fastify.pg.query(
        addToCartQuery,
        [userId, menuItemId, quantity]
      );
      return rows[0];
    }
    catch (err: any) {
      console.error("Failed to add item to cart:", err);
      throw new Error("Failed to add item to cart");
    }
  },

  // List all cart items for a user
  async list(userId: number) {
    try {
      const { rows } = await fastify.pg.query(
        listCartItemsQuery, 
        [userId]
     );
      return rows;
    }
    catch (err: any) {
      console.error("Failed to list cart items:", err);
      throw new Error("Failed to list cart items");
    }
  },

  // Update quantity for a specific item
  async updateQuantity(userId: number, menuItemId: number, quantity: number) {
    try {
      const { rows } = await fastify.pg.query(
        updateCartItemQuery,
        [userId, menuItemId, quantity]
      );
      return rows[0];
    }
    catch (err: any) {
      console.error("Failed to update quantity:", err);
      throw new Error("Failed to update quantity");
    }
  },

  // Remove one item from cart
  async removeItem(userId: number, menuItemId: number) {
    try {
      const { rows } = await fastify.pg.query(
        removeCartItemQuery,
        [userId, menuItemId]
      );
      return rows[0];
    }
    catch (err: any) {
      console.error("Failed to remove item:", err);
      throw new Error("Failed to remove item");
    }
  },

  // Clear entire cart for a user
  async clear(userId: number) {
    try {
      const { rows } = await fastify.pg.query(
        clearCartQuery,
        [userId]
      );
      return rows.length;
    }
    catch (err: any) {
      console.error("Failed to clear cart:", err);
      throw new Error("Failed to clear cart");
    }
  },

  // After checkout, reduce menu item quantity
  async afterCheckout(menuItemId: number, quantity: number) {
    try {
      const { rows } = await fastify.pg.query(
        afterCheckoutMenuQuery,
        [menuItemId, quantity]
      );
      
      return {
        success: true,
        data: rows[0]
      };
    }
    catch (err: any) {
      console.error("Failed to update menu quantity after checkout:", err);
      return {
        success: false,
        message: "You are trying to purchase more items than are in stock. Please adjust your cart and try again."
      };
    }
  }
});