import { FastifyInstance } from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import { softDeleteAccountQuery, updateAccountQuery, empDataQuery } from '../db/accountQueries.ts';
import { Account } from '../models/accountModel.ts';

export const AccountRepository = (fastify: FastifyInstance) => ({
    // soft delete account
    async deleteAccount(id: number) {
        const { rows } = await fastify.pg.query(
            softDeleteAccountQuery,
            [id]
        );

        return rows[0];
    },

    // update account
    async updateAccount(id: number, accountData: Partial<Account>) {
        const { name, email, account_type } = accountData;
        const { rows } = await fastify.pg.query(
            updateAccountQuery,
            [name, email, account_type, id]
        );

        return rows[0];
    },

    // get employee data
    async getEmployee(empId: number) {
        const { rows } = await fastify.pg.query(
            empDataQuery,
            [empId]
        );

        return rows;
    }
});