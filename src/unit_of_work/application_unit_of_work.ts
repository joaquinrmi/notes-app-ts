import db from "../db";
import Book from "../model/book";
import Note from "../model/note/note";
import User from "../model/user";
import BookRepository from "../repositories/book";
import NoteRepository from "../repositories/note";
import UserRepository from "../repositories/user";
import Repository from "../repository/repository";
import UnitOfWork from "./unit_of_work";
import { Transaction } from "sequelize";

class ApplicationUnitOfWork implements UnitOfWork
{
    private _transaction?: Transaction;
    private _userRepository: UserRepository;
    private _bookRepository: BookRepository;
    private _noteRepository: NoteRepository;

    constructor(transaction?: Transaction)
    {
        this._transaction = transaction;
    }

    public get transaction(): Transaction
    {
        return this._transaction;
    }

    public get userRepository(): Repository<User>
    {
        return this._userRepository;
    }

    public get bookRepository(): Repository<Book>
    {
        return this._bookRepository;
    }

    public get noteRepository(): Repository<Note>
    {
        return this._noteRepository;
    }

    public async saveChanges(): Promise<void>
    {
        await this._transaction.commit();
    }

    public async discardChanges(): Promise<void>
    {
        await this._transaction.rollback();
    }

    public async initialize(): Promise<void>
    {
        if(!this._transaction)
        {
            this._transaction = await db.transaction();
        }

        this.setRepositories();
    }

    protected setRepositories(): void
    {
        this._userRepository = new UserRepository(this._transaction);
        this._bookRepository = new BookRepository(this._transaction);
        this._noteRepository = new NoteRepository(this._transaction);
    }
}

export default ApplicationUnitOfWork;