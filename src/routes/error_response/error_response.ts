import APIResponse from "../api_response";
import HttpStatusCode from "../http_status_code";

class ErrorResponse extends APIResponse
{
    constructor(httpStatusCode: HttpStatusCode, title: string = "No Title Available", errors: {[Key: string]: any} = {})
    {
        super(httpStatusCode, {
            title,
            errors
        });
    }
}

export default ErrorResponse;