import Book from "../../model/book";
import BookData from "../../model/book/book_data";
import User from "../../model/user";
import SubordinateUnitOfWork from "../../unit_of_work/subordinate_unit_of_work";
import UnitOfWork from "../../unit_of_work/unit_of_work";
import ApplicationNoteService from "../note/application_note_service";
import BookService from "./book_service";
import BookServiceData from "./data/book_service_data";
import CreateBookData from "./data/create_book_data";
import DeleteBookData from "./data/delete_book_data";
import DeleteBooksByUser from "./data/delete_books_by_user";
import GetBooksByUserData from "./data/get_books_by_user_data";
import UpdateBookData from "./data/update_book_data";
import BookDoesNotExistError from "./error/book_does_not_exist_error";

class ApplicationBookService implements BookService
{
    private _unitOfWork: UnitOfWork;

    constructor(unitOfWork: UnitOfWork)
    {
        this._unitOfWork = unitOfWork;
    }

    public async getBooksByUser(data: GetBooksByUserData): Promise<BookServiceData[]>
    {
        let replacements: any = {
            userId: data.userId
        };
        let sortDirection = data.sortDirection ? data.sortDirection.toUpperCase() : "DESC";
        let where = "";
        let orderBy = "ORDER BY b.id";

        switch(data.sortBy)
        {
        case "date_created":
            orderBy = "ORDER BY b.date_created";
            if(typeof data.lastDate === "number")
            {
                where = `b.date_created ${this.directionCondition(sortDirection)} :lastDate`;
                replacements["lastDate"] = new Date(data.lastDate);
            }
            break;

        case "date_updated":
            orderBy = "ORDER BY b.date_updated";
            if(typeof data.lastDate === "number")
            {
                where = `b.date_updated ${this.directionCondition(sortDirection)} :lastDate`;
                replacements["lastDate"] = new Date(data.lastDate);
            }
            break;

        default:
            if(typeof data.lastId === "number")
            {
                where = `b.id ${this.directionCondition(sortDirection)} :lastId`;
                replacements["lastId"] = data.lastId;
            }
            break;
        }

        const query = `SELECT b.id, b.title, b.date_created, b.date_updated
            FROM ${Book.tableName} AS b
            JOIN ${User.tableName} AS u ON u.id = b.user_id
            WHERE u.id = :userId ${where.length > 0 ? `AND (${where})` : ""}
            ${orderBy}
            ${sortDirection}
            LIMIT 20`;

        const elements = await this._unitOfWork.bookRepository.getByQuery<BookData>(query, replacements);

        const resultElements = new Array<BookServiceData>(elements.length);
        for(let i = 0; i < elements.length; ++i)
        {
            resultElements[i] = this.bookDataToServiceData(elements[i]);
        }

        await this._unitOfWork.saveChanges();

        return resultElements;
    }

    public async createBook(data: CreateBookData): Promise<BookServiceData>
    {
        const now = new Date();

        const book = await this._unitOfWork.bookRepository.create({
            user_id: data.userId,
            title: data.title,
            date_created: now,
            date_updated: now
        });
        
        await this._unitOfWork.saveChanges();

        return {
            id: book.id,
            title: book.title,
            dateCreated: book.date_created.getTime(),
            dateUpdated: book.date_updated.getTime()
        };
    }

    public async updateBook(data: UpdateBookData): Promise<void>
    {
        const book = await this._unitOfWork.bookRepository.findOne({ id: data.bookId, user_id: data.userId });
        if(!book)
        {
            throw new BookDoesNotExistError();
        }

        try
        {
            await this._unitOfWork.bookRepository.update({
                id: data.bookId,
                title: data.title,
                date_updated: new Date()
            });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    public async deleteBook(data: DeleteBookData): Promise<void>
    {
        if(!(await this._unitOfWork.bookRepository.findOne({ id: data.bookId, user_id: data.userId })))
        {
            throw new BookDoesNotExistError();
        }
        
        const noteService = new ApplicationNoteService(SubordinateUnitOfWork.create(this._unitOfWork));

        try
        {
            await noteService.deleteNotesByBook({ bookId: data.bookId });
            await this._unitOfWork.bookRepository.delete(data.bookId);
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    public async deleteBooksByUser(data: DeleteBooksByUser): Promise<void>
    {
        const noteService = new ApplicationNoteService(SubordinateUnitOfWork.create(this._unitOfWork));

        try
        {
            await noteService.deleteNotesByUser({ userId: data.userId });
            await this._unitOfWork.bookRepository.deleteMany({ user_id: data.userId });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    private bookDataToServiceData(book: BookData): BookServiceData
    {
        return {
            id: book.id,
            title: book.title,
            dateCreated: book.date_created.getTime(),
            dateUpdated: book.date_updated.getTime()
        };
    }

    private directionCondition(sortDirection: string): string
    {
        if(sortDirection === "ASC") return ">";
        else return "<";
    }
}

export default ApplicationBookService;