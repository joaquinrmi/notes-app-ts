import { Transaction, WhereOptions } from "sequelize";
import Note from "../../model/note/note";
import BaseRepository from "../../repository/base_repository";
import EntityData from "../../repository/entity_data";
import DBError from "../../repository/error/db_error";

class NoteRepository extends BaseRepository<Note>
{
    constructor(transaction?: Transaction)
    {
        super(transaction);
    }

    public override async create(element: EntityData<Note>): Promise<Note>
    {
        try
        {
            return await Note.create(
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
            await Note.destroy({
                where: { id },
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async deleteMany(query: WhereOptions<EntityData<Note>>): Promise<void>
    {
        try
        {
            await Note.destroy({
                where: query,
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async update(element: EntityData<Note>): Promise<void>
    {
        try
        {
            await Note.update(
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

    public override async getById(id: number): Promise<Note>
    {
        try
        {
            return await Note.findByPk(id);
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async findOne(query: WhereOptions<EntityData<Note>>): Promise<Note>
    {
        try
        {
            return await Note.findOne({ where: query });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }
}

export default NoteRepository;