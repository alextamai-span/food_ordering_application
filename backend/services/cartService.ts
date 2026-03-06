import { FastifyInstance } from "fastify";
import { CartRepository } from "../repository/cartRepository";

export const CartService = (fastify: FastifyInstance) => {
  const repo = CartRepository(fastify);

  return {
    async addItem(userId: number, menuItemId: number, quantity: number) {
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");
      return repo.addItem(userId, menuItemId, quantity);
    },

    async list(userId: number) {
      return repo.list(userId);
    },

    async updateQuantity(userId: number, menuItemId: number, quantity: number) {
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");
      return repo.updateQuantity(userId, menuItemId, quantity);
    },

    async removeItem(userId: number, menuItemId: number) {
      return repo.removeItem(userId, menuItemId);
    },

    async clear(userId: number) {
      return repo.clear(userId);
    },

    async afterCheckoutMenu(menuItemId: number, quantity: number) {
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");
      return repo.afterCheckout(menuItemId, quantity);
    }
  };
};