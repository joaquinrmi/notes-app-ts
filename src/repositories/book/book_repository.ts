import { Transaction, WhereOptions } from "sequelize";
import Book from "../../model/book/book";
import BaseRepository from "../../repository/base_repository";
import EntityData from "../../repository/entity_data";
import DBError from "../../repository/error/db_error";

class BookRepository extends BaseRepository<Book>
{
    constructor(transaction?: Transaction)
    {
        super(transaction);
    }

    public override async create(element: EntityData<Book>): Promise<Book>
    {
        try
        {
            return await Book.create(
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
            await Book.destroy({
                where: { id },
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async deleteMany(query: WhereOptions<EntityData<Book>>): Promise<void>
    {
        try
        {
            await Book.destroy({
                where: query,
                transaction: this.transaction
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async update(element: EntityData<Book>): Promise<void>
    {
        try
        {
            await Book.update(
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

    public override async getById(id: number): Promise<Book>
    {
        try
        {
            return await Book.findByPk(id);
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public override async findOne(query: WhereOptions<EntityData<Book>>): Promise<Book>
    {
        try
        {
            return await Book.findOne({ where: query });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }
}

export default BookRepository;