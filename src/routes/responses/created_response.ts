import APIResponse from "../api_response";
import HttpStatusCode from "../http_status_code";

class CreatedResponse extends APIResponse
{
    constructor(content?: any)
    {
        super(HttpStatusCode.Created, content);
    }
}

export default CreatedResponse;