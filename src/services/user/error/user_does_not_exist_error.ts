import ModelError from "../../../repository/error/model_error";

class UserDoesNotExistError extends ModelError
{
    constructor()
    {
        super(UserDoesNotExistError.name, "User does not exist.");
    }
}

export default UserDoesNotExistError;