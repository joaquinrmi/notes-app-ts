import { Model, DataTypes } from "sequelize";
import UserData from "./user_data";
import db from "../../db";

class User extends Model<UserData>
{
    declare id: number;
    declare email: string;
    declare password: string;
}

export async function initializeUser(): Promise<void>
{
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        },
        {
            sequelize: db,
            tableName: "users",
            timestamps: false,
            indexes: [
                {
                    fields: [ "email" ],
                    unique: true
                },
            ]
        }
    );

    await User.sync();
}

export default User;