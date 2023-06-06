import ErrorResponse from "../../../error_response";
import HttpStatusCode from "../../../http_status_code";

class BookDoesNotExistResponse extends ErrorResponse
{
    constructor()
    {
        super(HttpStatusCode.Conflict, "The Book Does Not Exist");
    }
}

export default BookDoesNotExistResponse;