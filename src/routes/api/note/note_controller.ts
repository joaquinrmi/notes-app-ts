import { Request, Response } from "express";
import ApplicationController from "../../controller/application_controller";
import useCredentials from "../../middlewares/use_credentials";
import useInputDefinition from "../../middlewares/use_input_definition";
import GetNotesQuery from "./data/get_notes_query";
import { Validation } from "../../validation";
import Casting from "../../casting";
import useInput from "../../middlewares/use_input";
import CreateNoteForm from "./data/create_note_form";
import ModelError from "../../../repository/error/model_error";
import DBError from "../../../repository/error/db_error";
import InternalServerErrorResponse from "../../responses/internal_server_error_response";
import OkResponse from "../../responses/ok_response";
import BookDoesNotExistError from "../../../services/book/error/book_does_not_exist_error";
import BookDoesNotExistResponse from "../book/responses/book_does_not_exist_response";
import NotFoundResponse from "../../responses/not_found_response";
import CreatedResponse from "../../responses/created_response";
import UpdateNoteForm from "./data/update_note_form";
import NoContentResponse from "../../responses/no_content_response";
import DeleteNoteParams from "./data/delete_note_params";
import NoteDoesNotExistError from "../../../services/note/error/note_does_not_exist_error";
import NoteDoesNotExistResponse from "./responses/note_does_not_exist_response";

/**
 * ROUTES
 * / [GET]: returns a list of notes based on the received query.
 * / [POST]: creates a new note.
 * / [PATCH]: edits a note.
 * /:id [DELETE]: deletes a note by its id.
 */
class NoteController extends ApplicationController
{
    constructor()
    {
        super();
    }

    protected override registerRoutes(): void
    {
        this.router.route("/")
            .get([
                useCredentials,
                useInputDefinition<GetNotesQuery>(
                    "query",
                    {
                        bookId: {
                            validator: Validation.canBeNumber(),
                            errorMessage: `The "bookId" parameter must be a number.`,
                            cast: Casting.toNumber()
                        },
                        lastId: {
                            validator: Validation.optional(Validation.canBeNumber()),
                            errorMessage: `The "lastId" parameter must be a number.`,
                            cast: Casting.toNumber()
                        },
                        lastDate: {
                            validator: Validation.optional(Validation.canBeNumber()),
                            errorMessage: `The "lastDate" parameter must be a number.`,
                            cast: Casting.toNumber()
                        },
                        sortBy: {
                            validator: Validation.optional(Validation.in([ "default", "date_created", "date_updated" ])),
                            errorMessage: `The "sortBy" parameter can be "default", "date_created" or "date_updated".`
                        },
                        sortDirection: {
                            validator: Validation.optional(Validation.in([ "asc", "desc" ])),
                            errorMessage: `The "sortDirection" parameter can be "asc" or "desc".`
                        }
                    }
                ),
                useInput<GetNotesQuery>("getNotesQuery"),
                this.getNotes
            ])
            .post([
                useCredentials,
                useInputDefinition<CreateNoteForm>(
                    "body",
                    {
                        bookId: {
                            validator: Validation.isNumber(),
                            errorMessage: `The "bookId" field must be a number.`
                        },
                        title: {
                            validator: Validation.isString().minLength(1),
                            errorMessage: `The "title" field must have at least 1 character.`
                        },
                        content: {
                            validator: Validation.isString(),
                            errorMessage: `The "content" field must be a string.`
                        }
                    }
                ),
                useInput<CreateNoteForm>("createNoteForm"),
                this.createNote
            ])
            .patch([
                useCredentials,
                useInputDefinition<UpdateNoteForm>(
                    "body",
                    {
                        noteId: {
                            validator: Validation.isNumber(),
                            errorMessage: `The "noteId" field must be a number.`
                        },
                        bookId: {
                            validator: Validation.optional(Validation.isNumber()),
                            errorMessage: `The "bookId" field must be a number.`
                        },
                        title: {
                            validator: Validation.optional(Validation.isString().minLength(1)),
                            errorMessage: `The "title" field must have at least 1 character.`
                        },
                        content: {
                            validator: Validation.optional(Validation.isString()),
                            errorMessage: `The "content" field must be a string.`
                        }
                    }
                ),
                useInput<UpdateNoteForm>("updateNoteForm"),
                this.updateNote
            ])

        this.router.route("/:id")
            .delete([
                useCredentials,
                useInputDefinition<DeleteNoteParams>(
                    "params",
                    {
                        id: {
                            validator: Validation.canBeNumber(),
                            errorMessage: `The "id" parameter must be a number.`,
                            cast: Casting.toNumber()
                        }
                    }
                ),
                useInput<DeleteNoteParams>("deleteNoteParams"),
                this.deleteNote
            ])
    }

    private async getNotes(req: Request, res: Response): Promise<void>
    {
        try
        {
            var notes = await req.noteService.getNotesByBook({
                userId: req.credentials.id,
                ...req.getNotesQuery
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case BookDoesNotExistError.name:
                return res.error(new BookDoesNotExistResponse());

            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        if(notes.length === 0)
        {
            return res.submit(new NotFoundResponse());
        }

        res.submit(new OkResponse(notes));
    }

    private async createNote(req: Request, res: Response): Promise<void>
    {
        try
        {
            var note = await req.noteService.createNote({
                userId: req.credentials.id,
                ...req.createNoteForm
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case BookDoesNotExistError.name:
                return res.error(new BookDoesNotExistResponse());
    
            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new CreatedResponse(note));
    }

    private async updateNote(req: Request, res: Response): Promise<void>
    {
        try
        {
            if(req.updateNoteForm.bookId !== undefined)
            {
                await req.noteService.moveToBook({
                    userId: req.credentials.id,
                    bookId: req.updateNoteForm.bookId,
                    noteId: req.updateNoteForm.noteId
                });
            }

            await req.noteService.updateNote({
                userId: req.credentials.id,
                ...req.updateNoteForm
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case NoteDoesNotExistError.name:
                return res.error(new NoteDoesNotExistResponse());
            
            case BookDoesNotExistError.name:
                return res.error(new BookDoesNotExistResponse());

            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new NoContentResponse());
    }

    private async deleteNote(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.noteService.deleteNote({
                userId: req.credentials.id,
                noteId: req.deleteNoteParams.id
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case NoteDoesNotExistError.name:
                return res.submit(new OkResponse());

            default:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new OkResponse());
    }
}

export default NoteController;