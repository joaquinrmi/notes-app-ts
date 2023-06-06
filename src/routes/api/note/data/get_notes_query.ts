import GetNotesByBook from "../../../../services/note/data/get_notes_by_book";

interface GetNotesQuery
{
    bookId: number;
    lastId?: number;
    lastDate?: number;
    sortBy?: GetNotesByBook["sortBy"];
    sortDirection?: GetNotesByBook["sortDirection"];
}

export default GetNotesQuery;