import ErrorResponse from "../error_response";
import HttpStatusCode from "../http_status_code";

class InvalidRequestErrorResponse<FormType> extends ErrorResponse
{
    constructor(messages: ParameterErrorMessages<FormType>)
    {
        super(HttpStatusCode.BadRequest, "Invalid Request", messages);
    }
}

export type ParameterErrorMessages<FormType> = {
    [Props in keyof FormType]?: string;
};

export default InvalidRequestErrorResponse;