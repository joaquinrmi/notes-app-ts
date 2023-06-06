import CreateNoteData from "./data/create_note_data";
import DeleteNoteData from "./data/delete_note_data";
import DeleteNotesByBookData from "./data/delete_notes_by_book_data";
import DeleteNotesByUserData from "./data/delete_notes_by_user_data";
import GetNoteData from "./data/get_note_data";
import GetNotesByBook from "./data/get_notes_by_book";
import MoveNoteToBookData from "./data/move_note_to_book_data";
import NoteServiceData from "./data/note_service_data";
import UpdateNoteData from "./data/update_note_data";

interface NoteService
{
    getNote(data: GetNoteData): Promise<NoteServiceData>;
    getNotesByBook(data: GetNotesByBook): Promise<NoteServiceData[]>;
    createNote(data: CreateNoteData): Promise<NoteServiceData>;
    updateNote(data: UpdateNoteData): Promise<void>;
    deleteNote(data: DeleteNoteData): Promise<void>;
    deleteNotesByBook(data: DeleteNotesByBookData): Promise<void>;
    deleteNotesByUser(data: DeleteNotesByUserData): Promise<void>;
    moveToBook(data: MoveNoteToBookData): Promise<void>;
}

export default NoteService;