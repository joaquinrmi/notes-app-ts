import ErrorResponse from "../error_response";
import HttpStatusCode from "../http_status_code";

class InternalServerErrorResponse extends ErrorResponse
{
    constructor()
    {
        super(HttpStatusCode.InternalServerError, "Internal Server Error");
    }
}

export default InternalServerErrorResponse;