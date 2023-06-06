import { Transaction } from "sequelize";
import Book from "../model/book";
import Note from "../model/note/note";
import User from "../model/user";
import Repository from "../repository/repository";

interface UnitOfWork
{
    get transaction(): Transaction;
    get userRepository(): Repository<User>;
    get bookRepository(): Repository<Book>;
    get noteRepository(): Repository<Note>;

    saveChanges(): Promise<void>;
    discardChanges(): Promise<void>;
}

export default UnitOfWork;