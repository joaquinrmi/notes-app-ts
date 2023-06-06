import APIResponse from "../api_response";
import HttpStatusCode from "../http_status_code";

class NotFoundResponse extends APIResponse
{
    constructor()
    {
        super(HttpStatusCode.NotFound);
    }
}

export default NotFoundResponse;