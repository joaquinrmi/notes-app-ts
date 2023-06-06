import { WhereOptions } from "sequelize";
import EntityData from "./entity_data";

interface Repository<T extends { id: number }>
{
    create(element: EntityData<T>): Promise<T>;
    delete(id: T["id"]): Promise<void>;
    deleteMany(query: WhereOptions<EntityData<T>>): Promise<void>;
    update(element: EntityData<T>): Promise<void>;
    findOne(query: WhereOptions<EntityData<T>>): Promise<T>;
    findAll(query: WhereOptions<EntityData<T>>): Promise<T[]>;
    getById(id: T["id"]): Promise<T>;
    exists(id: T["id"]): Promise<boolean>;
    runQuery(query: string, replacements?: any): Promise<void>;
    getByQuery<T>(query: string, replacements?: any): Promise<T[]>;
}

export default Repository;