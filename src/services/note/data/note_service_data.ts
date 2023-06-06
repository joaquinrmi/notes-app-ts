import Book from "../../../model/book/book";
import Note from "../../../model/note/note";

interface NoteServiceData
{
    id: Note["id"];
    bookId: Book["id"];
    title: Note["title"];
    content: Note["content"];
    dateCreated: number;
    dateUpdated: number;
}

export default NoteServiceData;