import { FastifyInstance } from 'fastify';
import { Menu } from '../models/MenuModel.ts';
import fastifyPostgres from '@fastify/postgres';
import { updateMenuItemQueryEmp, deleteMenuItemQueryEmp, addMenuItemQueryEmp, ListMenuQueryEmp } from '../db/menuQueries.ts';

export const EmpMenuRepository = (fastify: FastifyInstance) => ({
  // update Menu
  async updateMenuItemEmp(MenuId: number, MenuData: Menu): Promise<Menu> {
    try {
      const { rows } = await fastify.pg.query(
        updateMenuItemQueryEmp,
        [
          MenuData.item_name,
          MenuData.price,
          MenuData.quantity,
          MenuData.available,
          MenuId
        ]
      );
      return rows[0];
    }
    catch (error) {
      console.error('Failed to update Menu in the DB', error);
      throw new Error('Failed to update Menu in DB');
    }
  },

  // add menu item
  async addMenuItemEmp(MenuData: Menu): Promise<Menu> {
    try {
        const { rows } = await fastify.pg.query(
            addMenuItemQueryEmp,
            [
                MenuData.item_name,
                MenuData.price,
                MenuData.quantity,
                MenuData.available
            ]
        );
        return rows[0];
    }
    catch (error) {
        console.error('Failed to add menu item in the DB', error);
        throw new Error('Failed to add menu item in DB');
    }
},

  // delete Menu
  async deleteMenuItemEmp(MenuId: number): Promise<boolean> {
    try {
      const { rows } = await fastify.pg.query(
        deleteMenuItemQueryEmp,
        [MenuId]
      );
      return rows.length > 0;
    }
    catch (error) {
      console.error('Failed to delete Menu in the DB', error);
      throw new Error('Failed to delete Menu in DB');
    }
  },

  // listing all Menu
  async listAllMenuEmp(accountType: string): Promise<Menu[]> {
    try {
      const { rows } = await fastify.pg.query(
        ListMenuQueryEmp,
        [accountType]
      );
      
      return rows;
    }
    catch (error) {
      console.error('Failed to list Menu in the DB', error);
      throw new Error('Failed to list Menu in DB');
    }
  }
});