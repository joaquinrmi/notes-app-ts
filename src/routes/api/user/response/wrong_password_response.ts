import ErrorResponse from "../../../error_response";
import HttpStatusCode from "../../../http_status_code";

class WrongPasswordResponse extends ErrorResponse
{
    constructor()
    {
        super(HttpStatusCode.Unauthorized, "Wrong Password");
    }
}

export default WrongPasswordResponse;