import { Request, Response } from "express";
import ApplicationController from "../../controller/application_controller";
import useCredentials from "../../middlewares/use_credentials";
import useInput from "../../middlewares/use_input";
import useInputDefinition from "../../middlewares/use_input_definition";
import { Validation } from "../../validation";
import CreateBookForm from "./data/create_book_form";
import ModelError from "../../../repository/error/model_error";
import CreatedResponse from "../../responses/created_response";
import DBError from "../../../repository/error/db_error";
import InternalServerErrorResponse from "../../responses/internal_server_error_response";
import UpdateBookForm from "./data/update_book_form";
import BookDoesNotExistError from "../../../services/book/error/book_does_not_exist_error";
import NoContentResponse from "../../responses/no_content_response";
import BookDoesNotExistResponse from "./responses/book_does_not_exist_response";
import OkResponse from "../../responses/ok_response";
import Casting from "../../casting";
import GetBooksQuery from "./data/get_books_query";
import NotFoundResponse from "../../responses/not_found_response";

/**
 * This controller handles requests for working with books.
 * The book type returned by these routes is BookServiceData (src\services\book\data\book_service_data.ts).
 * 
 * ROUTES:
 * / [GET]: returns a list of books based on the received query.
 * / [POST]: creates a new Book.
 * / [PATCH]: edits the title of an existing Book.
 * /:id [DELETE]: deletes a Book by its id.
 */
class BookController extends ApplicationController
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
                useInputDefinition<GetBooksQuery>(
                    "query",
                    {
                        lastId: {
                            validator: Validation.optional(Validation.canBeNumber()),
                            errorMessage: `The "lastId" argument must be a number.`,
                            cast: Casting.toNumber()
                        },
                        lastDate: {
                            validator: Validation.optional(Validation.canBeNumber()),
                            errorMessage: `The "lastDate" argument must be a number.`,
                            cast: Casting.toNumber()
                        },
                        sortBy: {
                            validator: Validation.optional(Validation.in([ "default", "date_created", "date_updated" ])),
                            errorMessage: `The "shortBy" argument can be "default", "date_created" or "date_updated".`
                        },
                        sortDirection: {
                            validator: Validation.optional(Validation.in([ "asc", "desc" ])),
                            errorMessage: `The "sortDirection" argument can be "asc" or "desc".`
                        }
                    }
                ),
                useInput<GetBooksQuery>("getBooksQuery"),
                this.getBooks
            ])
            .post([
                useCredentials,
                useInputDefinition<CreateBookForm>(
                    "body",
                    {
                        title: {
                            validator: Validation.isString().minLength(1),
                            errorMessage: "The title must have at least 1 character."
                        }
                    }
                ),
                useInput<CreateBookForm>("createBookForm"),
                this.createBook
            ])
            .patch([
                useCredentials,
                useInputDefinition<UpdateBookForm>(
                    "body",
                    {
                        id: {
                            validator: Validation.isNumber(),
                            errorMessage: "The id must be a number."
                        },
                        title: {
                            validator: Validation.isString().minLength(1),
                            errorMessage: "The title must have at least 1 character."
                        }
                    }
                ),
                useInput<UpdateBookForm>("updateBookForm"),
                this.updateBook
            ])

        this.router.route("/:id")
            .delete([
                useCredentials,
                useInputDefinition<DeleteBookParams>(
                    "params",
                    {
                        id: {
                            validator: Validation.canBeNumber(),
                            errorMessage: "The id must be a number.",
                            cast: Casting.toNumber()
                        }
                    }
                ),
                useInput<DeleteBookParams>("deleteBookParams"),
                this.deleteBook
            ])
    }

    private async getBooks(req: Request, res: Response): Promise<void>
    {
        try
        {
            var books = await req.bookService.getBooksByUser({
                userId: req.credentials.id,
                ...req.getBooksQuery
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        if(books.length === 0)
        {
            return res.submit(new NotFoundResponse());
        }

        res.submit(new OkResponse(books));
    }

    private async createBook(req: Request, res: Response): Promise<void>
    {
        try
        {
            var book = await req.bookService.createBook({
                userId: req.credentials.id,
                title: req.createBookForm.title
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new CreatedResponse(book));
    }

    private async updateBook(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.bookService.updateBook({
                userId: req.credentials.id,
                bookId: req.updateBookForm.id,
                title: req.updateBookForm.title
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

        res.submit(new NoContentResponse());
    }

    private async deleteBook(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.bookService.deleteBook({
                userId: req.credentials.id,
                bookId: req.deleteBookParams.id
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case BookDoesNotExistError.name:
                return res.submit(new OkResponse());

            case DBError.name:
            default:
                console.error(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new OkResponse());
    }
}

export default BookController;