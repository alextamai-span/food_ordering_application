import { FastifyInstance } from "fastify";
import { CartController } from "../controllers/cartController";
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function cartRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", verifyJWT);

  fastify.post("/add_item", {
    schema: {
      tags: ["cart"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          menu_item_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 }
        },
        required: ["menu_item_id", "quantity"]
      }
    }
  }, CartController.addItem);

  fastify.get("/list", {
    schema: { 
      security: [{ bearerAuth: [] }],
      tags: ["cart"]
    }
  }, CartController.list);

  fastify.put("/update_quantity:menuItemId", {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["cart"],
      params: {
        type: "object",
        properties: {
          menuItemId: { type: "integer" }
        },
        required: ["menuItemId"]
      },
      body: {
        type: "object",
        properties: {
          quantity: { type: "integer", minimum: 1 }
        },
        required: ["quantity"]
      }
    }
  }, CartController.updateQuantity);

  fastify.delete("/remove_item:menuItemId", {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["cart"],
      params: {
        type: "object",
        properties: {
          menuItemId: { type: "integer" }
        },
        required: ["menuItemId"]
      }
    }
  }, CartController.removeItem);

  fastify.delete("/clear", {
    schema: { security: [{ bearerAuth: [] }], tags: ["cart"] }
  }, CartController.clear);

  fastify.put("/after_checkout_menu", {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["cart"],
      body: {
        type: "object",
        properties: {
          menuItemId: { type: "integer" },
          quantity: { type: "integer", minimum: 1 }
        },
        required: ["menuItemId", "quantity"]
      }
    }
  }, CartController.afterCheckoutMenu);
}