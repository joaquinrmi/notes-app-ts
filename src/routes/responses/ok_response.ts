import APIResponse from "../api_response";
import HttpStatusCode from "../http_status_code";

class OkResponse extends APIResponse
{
    constructor(content: any = {})
    {
        super(HttpStatusCode.OK, content);
    }
}

export default OkResponse;