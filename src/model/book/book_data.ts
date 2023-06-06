import UserData from "../user/user_data";

interface BookData
{
    id: number;
    user_id: UserData["id"];
    title: string;
    date_created: Date;
    date_updated: Date;
}

export default BookData;