import { FastifyRequest, FastifyReply } from 'fastify';
import { EmpMenuService } from '../services/empMenuService.ts';
import { Menu } from '../models/MenuModel.ts';
import { Account } from '../models/accountModel.ts';
import colors from 'console-log-colors'

// receive requests and respond to them
export const EmpMenuController = {
  // update Menu
  async updateMenuItemEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpMenuService(request.server);

    try {
      const { itemId } = request.params as { itemId: number };

      if (!itemId) {
        return reply.status(400).send({ message: 'itemId is required' });
      }

      const MenuData = request.body as Menu;
      const updatedMenu = await service.updateMenuItemEmp(itemId, MenuData);

      return reply.status(200).send({
        message: 'Menu updated successfully!',
        data: updatedMenu
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to update Menu' });
    }
  },

  // add menu item
  async addMenuItemEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpMenuService(request.server);

    try {
      const menuItemData = request.body as any;
      const newMenuItem = await service.addMenuItemEmp(menuItemData);

      return reply.status(201).send({
        message: 'Menu item added successfully!',
        data: newMenuItem
      });
    }
    catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({ message: 'Failed to add menu item' });
    }
},

  // list Menu
  async listEmpMenu(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpMenuService(request.server);

    try {
      const rows = await service.getAllMenuEmp();
      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving Menus' });
    }
  },

  // delete Menu
  async deleteMenuItemEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpMenuService(request.server);
  
    try {
      const { itemId } = request.params as { itemId: number };

      if (!itemId) {
        return reply.status(400).send({ message: 'itemId is required' });
      }

      const deleted = await service.deleteMenuItemEmp(itemId);

      if (!deleted) {
        return reply.status(404).send({ message: 'Menu not found' });
      }

      return reply.status(200).send({
        message: 'Menu deleted successfully!',
        deleted
      });
    } 
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to delete Menu' });
    }
  }

};