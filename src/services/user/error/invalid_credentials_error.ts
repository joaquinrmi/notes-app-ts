import ModelError from "../../../repository/error/model_error";

class InvalidCredentialsError extends ModelError
{
    constructor()
    {
        super(InvalidCredentialsError.name, "Invalid credentials.");
    }
}

export default InvalidCredentialsError;