import LoginForm from "../../routes/api/auth/data/login_form";
import CreateBookForm from "../../routes/api/book/data/create_book_form";
import GetBooksQuery from "../../routes/api/book/data/get_books_query";
import UpdateBookForm from "../../routes/api/book/data/update_book_form";
import CreateNoteForm from "../../routes/api/note/data/create_note_form";
import DeleteNoteParams from "../../routes/api/note/data/delete_note_params";
import GetNotesQuery from "../../routes/api/note/data/get_notes_query";
import UpdateNoteForm from "../../routes/api/note/data/update_note_form";
import CreateUserForm from "../../routes/api/user/data/create_user_form";
import DeleteUserForm from "../../routes/api/user/data/delete_user_form";
import UpdateUserForm from "../../routes/api/user/data/update_user_form";
import Credentials from "../../routes/auth/credentials";
import BookService from "../../services/book/book_service";
import NoteService from "../../services/note/note_service";
import UserService from "../../services/user/user_service";
import UnitOfWork from "../../unit_of_work/unit_of_work";

interface RequestDefinition
{
    unitOfWork: UnitOfWork;
    userService: UserService;
    noteService: NoteService;
    bookService: BookService;

    credentials: Credentials;

    createUserForm: CreateUserForm;
    updateUserForm: UpdateUserForm;
    deleteUserForm: DeleteUserForm;

    loginForm: LoginForm;

    getBooksQuery: GetBooksQuery;
    createBookForm: CreateBookForm;
    updateBookForm: UpdateBookForm;
    deleteBookParams: DeleteBookParams;

    getNotesQuery: GetNotesQuery;
    createNoteForm: CreateNoteForm;
    updateNoteForm: UpdateNoteForm;
    deleteNoteParams: DeleteNoteParams;
}

export default RequestDefinition;