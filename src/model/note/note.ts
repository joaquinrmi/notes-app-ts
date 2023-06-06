import { Model, DataTypes } from "sequelize";
import db from "../../db";
import NoteData from "./note_data";
import Book from "../book";

class Note extends Model<NoteData>
{
    declare id: NoteData["id"];
    declare book_id: NoteData["book_id"];
    declare title: NoteData["title"];
    declare content: NoteData["content"];
    declare date_created: NoteData["date_created"];
    declare date_updated: NoteData["date_updated"];
}

export async function initializeNote(): Promise<void>
{
    Note.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Book.tableName,
                    key: "id"
                }
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            date_created: {
                type: DataTypes.DATE,
                allowNull: false
            },
            date_updated: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize: db,
            tableName: "notes",
            timestamps: false,
            indexes: [
                {
                    fields: [ "book_id" ],
                    unique: false
                }
            ]
        }
    );

    await Note.sync();
}

export default Note;