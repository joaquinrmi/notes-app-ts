import ModelError from "../../../repository/error/model_error";

class BookDoesNotExistError extends ModelError
{
    constructor()
    {
        super(BookDoesNotExistError.name, "The book does not exist.");
    }
}

export default BookDoesNotExistError;