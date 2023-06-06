import ModelError from "./model_error";

class DBError extends ModelError
{
    constructor(details: any)
    {
        super(DBError.name, String(details));
    }
}

export default DBError;