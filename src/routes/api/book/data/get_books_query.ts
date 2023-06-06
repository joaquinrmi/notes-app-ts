import GetBooksByUserData from "../../../../services/book/data/get_books_by_user_data";

interface GetBooksQuery
{
    lastId?: number;
    lastDate?: number;
    sortBy?: GetBooksByUserData["sortBy"];
    sortDirection?: GetBooksByUserData["sortDirection"];
}

export default GetBooksQuery;