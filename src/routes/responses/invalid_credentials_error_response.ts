import ErrorResponse from "../error_response";
import HttpStatusCode from "../http_status_code";

class InvalidCredentialsErrorResponse extends ErrorResponse
{
    constructor()
    {
        super(HttpStatusCode.Unauthorized, "Invalid Credentials");
    }
}

export default InvalidCredentialsErrorResponse;