import { NextFunction, Request, Response } from "express";
import MiddlewareFunction from "./middleware_function";
import InvalidRequestErrorResponse, { ParameterErrorMessages } from "../responses/invalid_request_error_response";
import PropertyCast from "../casting/property_cast";
import InternalServerErrorResponse from "../responses/internal_server_error_response";
import { Validation } from "../validation";

export type InputDefinition<T> = {
    [Key in keyof T]: {
        validator: Validation,
        errorMessage?: string,
        cast?: PropertyCast<T[Key]>,
    };
};

function useInputDefinition<FormType>(source: "body" | "params" | "query", definition: InputDefinition<FormType>): MiddlewareFunction
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        const rawData = req[source];

        let messages: ParameterErrorMessages<FormType>;
        for(let key in definition)
        {
            const def = definition[key];

            const error = !def.validator.end()(rawData[key]);
            if(error)
            {
                if(typeof messages === "undefined")
                {
                    messages = {};
                }

                messages[key] = def.errorMessage || "No message specified.";
            }
        }

        if(messages)
        {
            return res.error(new InvalidRequestErrorResponse(messages));
        }

        try
        {
            var form: any = {};
            for(let key in definition)
            {
                if(rawData[key] === undefined)
                {
                    continue;
                }

                if(definition[key].cast)
                {
                    form[key] = definition[key].cast(rawData[key]);
                }
                else
                {
                    form[key] = rawData[key];
                }
            }
        }
        catch(err)
        {
            console.error(err);
            return res.error(new InternalServerErrorResponse());
        }

        if(req.rawInput === undefined)
        {
            req.rawInput = form;
        }
        else
        {
            req.rawInput = {
                ...req.rawInput,
                ...form
            };
        }

        next();
    };
}

export default useInputDefinition;