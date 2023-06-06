import BookData from "../book/book_data";

interface NoteData
{
    id: number;
    book_id: BookData["id"];
    title: string;
    content: string;
    date_created: Date;
    date_updated: Date;
}

export default NoteData;