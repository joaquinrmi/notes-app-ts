import ErrorResponse from "../../../error_response";
import HttpStatusCode from "../../../http_status_code";

class NoteDoesNotExistResponse extends ErrorResponse
{
    constructor()
    {
        super(HttpStatusCode.Conflict, "Note Does Not Exist");
    }
}

export default NoteDoesNotExistResponse;