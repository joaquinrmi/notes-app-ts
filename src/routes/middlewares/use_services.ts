import { NextFunction, Request, Response } from "express";
import ApplicationUserService from "../../services/user/application_user_service";
import ApplicationBookService from "../../services/book/application_book_service";
import ApplicationNoteService from "../../services/note/application_note_service";

function useServices(req: Request, res: Response, next: NextFunction): void
{
    req.userService = new ApplicationUserService(req.unitOfWork);
    req.bookService = new ApplicationBookService(req.unitOfWork);
    req.noteService = new ApplicationNoteService(req.unitOfWork);

    next();
}

export default useServices;