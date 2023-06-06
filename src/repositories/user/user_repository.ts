import { Transaction, WhereOptions } from "sequelize";
import BaseRepository from "../../repository/base_repository";
import User from "../../model/user";
import EntityData from "../../repository/entity_data";
import DBError from "../../repository/error/db_error";

class UserRepository extends BaseRepository<User>
{
    constructor(transaction?: Transaction)
    {
        super(transaction);
    }

    public override async create(element: EntityData<User>): Promise<User>
    {
        try
        {
            return await User.create(
                element,
                {
                    transaction: this.transaction
                }
            );
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async delete(id: number): Promise<void>
    {
        try
        {
            await User.destroy({
                where: { id },
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async deleteMany(query: WhereOptions<EntityData<User>>): Promise<void>
    {
        try
        {
            await User.destroy({
                where: query,
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async update(element: EntityData<User>): Promise<void>
    {
        try
        {
            await User.update(
                element,
                {
                    where: { id: element.id },
                    transaction: this.transaction
                }
            );
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async getById(id: number): Promise<User>
    {
        try
        {
            return await User.findByPk(id);
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async findOne(query: WhereOptions<EntityData<User>>): Promise<User>
    {
        try
        {
            return await User.findOne({ where: query });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }
}

export default UserRepository;