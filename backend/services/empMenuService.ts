import { FastifyInstance } from 'fastify';
import { EmpMenuRepository } from '../repository/empMenuRepository.ts';
import { Menu } from '../models/MenuModel.ts';

export const EmpMenuService = (fastify: FastifyInstance) => {
  const repo = EmpMenuRepository(fastify);

  return {
    // update Menu
    async updateMenuItemEmp(MenuId: number, MenuData: Menu): Promise<Menu> {
      return await repo.updateMenuItemEmp(MenuId, MenuData);
    },

    // delete Menu
    async deleteMenuItemEmp(MenuId: number): Promise<boolean> {
      return repo.deleteMenuItemEmp(MenuId);
    },

    // add Menu
    async addMenuItemEmp(MenuData: Menu): Promise<Menu> {
      return await repo.addMenuItemEmp(MenuData);
    },

    // listing all Menus
    async getAllMenuEmp(): Promise<Menu[]> {
      return await repo.listAllMenuEmp();
    },

    // getting employee data
    async getEmpData(empID: number): Promise<Menu[]> {
      return await repo.getEmployee(empID);
    }
  };
};