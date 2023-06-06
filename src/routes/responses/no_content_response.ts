import APIResponse from "../api_response";
import HttpStatusCode from "../http_status_code";

class NoContentResponse extends APIResponse
{
    constructor()
    {
        super(HttpStatusCode.NoContent, {});
    }
}

export default NoContentResponse;