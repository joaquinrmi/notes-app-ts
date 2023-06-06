import APIResponse from "../../routes/api_response";
import ErrorResponse from "../../routes/error_response";
import RequestDefinition from "./request_definition";

declare global
{
    namespace Express
    {
        interface Request extends RequestDefinition
        {
            rawInput: any;
        }

        interface Response
        {
            submit(apiResponse: APIResponse): void;
            error(error: ErrorResponse): void,
        }
    }
}