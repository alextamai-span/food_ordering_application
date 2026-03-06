import { FastifyReply, FastifyRequest } from "fastify";
import { CartService } from "../services/cartService";
import colors from "console-log-colors";

export const CartController = {
  async addItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const { menu_item_id, quantity } = request.body as { menu_item_id: number; quantity: number };
      
      const data = await CartService(request.server).addItem(userId, menu_item_id, quantity);
      
      return reply.status(201).send({ message: "Item added to cart", data });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(400).send({ message: err.message || "Failed to add item" });
    }
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const data = await CartService(request.server).list(userId);
      
      return reply.status(200).send(data);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: "Failed to load cart" });
    }
  },

  async updateQuantity(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const { quantity } = request.body as { quantity: number };
      const { menuItemId } = request.params as { menuItemId: number };
      const data = await CartService(request.server).updateQuantity(userId, menuItemId, quantity);
      
      return reply.status(200).send({ message: "Cart updated", data });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(400).send({ message: err.message || "Failed to update cart" });
    }
  },

  async removeItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const { menuItemId } = request.params as { menuItemId: number };
      await CartService(request.server).removeItem(userId, Number(menuItemId));
      
      return reply.status(200).send({ message: "Item removed from cart" });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: "Failed to remove item" });
    }
  },

  async clear(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      await CartService(request.server).clear(userId);
      
      return reply.status(200).send({ message: "Cart cleared" });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: "Failed to clear cart" });
    }
  },
  
  async afterCheckoutMenu(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { menuItemId, quantity } = request.body as { menuItemId: number; quantity: number };
      const data = await CartService(request.server).afterCheckoutMenu(menuItemId, quantity);

      return reply.status(200).send({ message: "Menu updated after checkout", data });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(400).send({ message: err.message || "Failed to update menu after checkout" });
    }
  }
};