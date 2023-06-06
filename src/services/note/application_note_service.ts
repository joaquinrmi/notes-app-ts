import Book from "../../model/book";
import Note from "../../model/note/note";
import NoteData from "../../model/note/note_data";
import User from "../../model/user";
import UnitOfWork from "../../unit_of_work/unit_of_work";
import BookDoesNotExistError from "../book/error/book_does_not_exist_error";
import CreateNoteData from "./data/create_note_data";
import DeleteNoteData from "./data/delete_note_data";
import DeleteNotesByBookData from "./data/delete_notes_by_book_data";
import DeleteNotesByUserData from "./data/delete_notes_by_user_data";
import GetNoteData from "./data/get_note_data";
import GetNotesByBook from "./data/get_notes_by_book";
import MoveNoteToBookData from "./data/move_note_to_book_data";
import NoteServiceData from "./data/note_service_data";
import UpdateNoteData from "./data/update_note_data";
import NoteDoesNotExistError from "./error/note_does_not_exist_error";
import NoteService from "./note_service";

class ApplicationNoteService implements NoteService
{
    private _unitOfWork: UnitOfWork;

    constructor(unitOfWork: UnitOfWork)
    {
        this._unitOfWork = unitOfWork;
    }

    public async getNote(data: GetNoteData): Promise<NoteServiceData>
    {
        const note = await this.getNoteById(data);

        await this._unitOfWork.saveChanges();

        return note;
    }

    public async getNotesByBook(data: GetNotesByBook): Promise<NoteServiceData[]>
    {
        if(!(await this.checkOwner(data.userId, data.bookId)))
        {
            throw new BookDoesNotExistError();
        }

        let replacements: any = {
            bookId: data.bookId
        };
        let sortDirection = data.sortDirection ? data.sortDirection.toUpperCase() : "DESC";
        let where = "";
        let orderBy = "ORDER BY n.id";

        switch(data.sortBy)
        {
        case "date_created":
            orderBy = "ORDER BY n.date_created";
            if(typeof data.lastDate === "number")
            {
                where = `n.date_created ${this.directionCondition(sortDirection)} :lastDate`;
                replacements["lastDate"] = new Date(data.lastDate);
            }
            break;

        case "date_updated":
            orderBy = "ORDER BY n.date_updated";
            if(typeof data.lastDate === "number")
            {
                where = `n.date_updated ${this.directionCondition(sortDirection)} :lastDate`;
                replacements["lastDate"] = new Date(data.lastDate);
            }
            break;

        default:
            if(typeof data.lastId === "number")
            {
                where = `n.id ${this.directionCondition(sortDirection)} :lastId`;
                replacements["lastId"] = data.lastId;
            }
            break;
        }

        const query = `SELECT n.id, n.book_id, n.title, n.content, n.date_created, n.date_updated
            FROM ${Note.tableName} AS n
            JOIN ${Book.tableName} AS b ON b.id = n.book_id
            WHERE b.id = :bookId ${where.length > 0 ? ` AND (${where})` : ""}
            ${orderBy}
            ${sortDirection}
            LIMIT 20`;

        const elements = await this._unitOfWork.noteRepository.getByQuery<NoteData>(query, replacements);

        const resultElements = new Array<NoteServiceData>(elements.length);
        for(let i = 0; i < elements.length; ++i)
        {
            resultElements[i] = this.noteDataToServiceData(elements[i]);
        }

        await this._unitOfWork.saveChanges();

        return resultElements;
    }

    public async createNote(data: CreateNoteData): Promise<NoteServiceData>
    {
        if(!(await this.checkOwner(data.userId, data.bookId)))
        {
            throw new BookDoesNotExistError();
        }

        try
        {
            const now = new Date();

            var note = await this._unitOfWork.noteRepository.create({
                book_id: data.bookId,
                title: data.title,
                content: data.content,
                date_created: now,
                date_updated: now
            });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();

        return this.noteDataToServiceData(note);
    }

    public async updateNote(data: UpdateNoteData): Promise<void>
    {
        await this.getNoteById({ noteId: data.noteId, userId: data.userId });

        try
        {
            await this._unitOfWork.noteRepository.update({
                id: data.noteId,
                title: data.title,
                content: data.content,
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

    public async deleteNote(data: DeleteNoteData): Promise<void>
    {
        await this.getNoteById({ noteId: data.noteId, userId: data.userId });

        try
        {
            await this._unitOfWork.noteRepository.delete(data.noteId);
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    public async deleteNotesByBook(data: DeleteNotesByBookData): Promise<void>
    {
        try
        {
            await this._unitOfWork.noteRepository.deleteMany({ book_id: data.bookId });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    public async deleteNotesByUser(data: DeleteNotesByUserData): Promise<void>
    {
        const query = `DELETE FROM ${Note.tableName} AS n
            WHERE n.book_id IN (
                SELECT b.id FROM ${Book.tableName} AS b
                WHERE b.user_id = :userId
            )`;

        try
        {
            await this._unitOfWork.noteRepository.runQuery(query, { userId: data.userId });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    public async moveToBook(data: MoveNoteToBookData): Promise<void>
    {
        await this.getNoteById({ noteId: data.noteId, userId: data.userId });

        if(!(await this.checkOwner(data.userId, data.bookId)))
        {
            throw new BookDoesNotExistError();
        }

        try
        {
            await this._unitOfWork.noteRepository.update({
                id: data.noteId,
                book_id: data.bookId
            });
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }

        await this._unitOfWork.saveChanges();
    }

    private async getNoteById(data: GetNoteData): Promise<NoteServiceData>
    {
        const note = await this._unitOfWork.noteRepository.getById(data.noteId);

        if(!(await this.checkOwner(data.userId, note.book_id)))
        {
            throw new NoteDoesNotExistError();
        }

        return this.noteDataToServiceData(note);
    }

    private async checkOwner(userId: User["id"], bookId: Book["id"])
    {
        return await this._unitOfWork.bookRepository.findOne({ id: bookId, user_id: userId});
    }

    private noteDataToServiceData(note: NoteData): NoteServiceData
    {
        return {
            id: note.id,
            bookId: note.book_id,
            title: note.title,
            content: note.content,
            dateCreated: note.date_created.getTime(),
            dateUpdated: note.date_updated.getTime()
        };
    }

    private directionCondition(sortDirection: string): string
    {
        if(sortDirection === "ASC") return ">";
        else return "<";
    }
}

export default ApplicationNoteService;