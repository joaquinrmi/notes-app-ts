import { Model, DataTypes } from "sequelize";
import db from "../../db";
import BookData from "./book_data";
import User from "../user";

class Book extends Model<BookData>
{
    declare id: BookData["id"];
    declare user_id: BookData["user_id"];
    declare title: BookData["title"];
    declare date_created: BookData["date_created"];
    declare date_updated: BookData["date_updated"];
}

export async function initializeBook(): Promise<void>
{
    Book.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.tableName,
                    key: "id"
                }
            },
            title: {
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
            tableName: "books",
            timestamps: false,
            indexes: [
                {
                    fields: [ "user_id" ],
                    unique: false
                }
            ]
        }
    );

    await Book.sync();
}

export default Book;