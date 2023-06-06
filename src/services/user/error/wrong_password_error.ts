import ModelError from "../../../repository/error/model_error";

class WrongPasswordError extends ModelError
{
    constructor()
    {
        super(WrongPasswordError.name, "Wrong password.")
    }
}

export default WrongPasswordError;