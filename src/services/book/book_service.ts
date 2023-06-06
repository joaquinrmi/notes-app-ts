import BookServiceData from "./data/book_service_data";
import CreateBookData from "./data/create_book_data";
import DeleteBookData from "./data/delete_book_data";
import DeleteBooksByUser from "./data/delete_books_by_user";
import GetBooksByUserData from "./data/get_books_by_user_data";
import UpdateBookData from "./data/update_book_data";

interface BookService
{
    getBooksByUser(data: GetBooksByUserData): Promise<BookServiceData[]>;
    createBook(data: CreateBookData): Promise<BookServiceData>;
    updateBook(data: UpdateBookData): Promise<void>;
    deleteBook(data: DeleteBookData): Promise<void>;
    deleteBooksByUser(data: DeleteBooksByUser): Promise<void>;
}

export default BookService;