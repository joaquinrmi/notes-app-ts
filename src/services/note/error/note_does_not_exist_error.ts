import ModelError from "../../../repository/error/model_error";

class NoteDoesNotExistError extends ModelError
{
    constructor()
    {
        super(NoteDoesNotExistError.name, "The note does not exist.");
    }
}

export default NoteDoesNotExistError;