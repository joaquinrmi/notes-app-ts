import { Transaction, WhereOptions } from "sequelize";
import db from "../db";
import Repository from "./repository";
import EntityData from "./entity_data";
import DBError from "./error/db_error";

class BaseRepository<T extends { id: number }> implements Repository<T>
{
    private _transaction?: Transaction;

    protected get transaction()
    {
        return this._transaction;
    }

    constructor(transaction?: Transaction)
    {
        this._transaction = transaction;
    }

    public async create(element: EntityData<T>): Promise<T>
    {
        throw new Error("Method not implemented.");
    }

    public async delete(id: T["id"]): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async deleteMany(query: WhereOptions<EntityData<T>>): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async update(element: EntityData<T>): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async findOne(query: WhereOptions<EntityData<T>>): Promise<T>
    {
        throw new Error("Method not implemented.");
    }

    public async findAll(query: WhereOptions<EntityData<T>>): Promise<T[]>
    {
        throw new Error("Method not implemented.");
    }

    public async getById(id: T["id"]): Promise<T>
    {
        throw new Error("Method not implemented.");
    }

    public async exists(id: T["id"]): Promise<boolean>
    {
        throw new Error("Method not implemented.");
    }

    public async runQuery(query: string, replacements?: any[]): Promise<void>
    {
        try
        {
            await db.query(query, { replacements, transaction: this.transaction });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public async getByQuery<T>(query: string, replacements?: any[]): Promise<T[]>
    {
        try
        {
            return (await db.query(query, { replacements, transaction: this.transaction }))[0] as any[];
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }
}

export default BaseRepository;