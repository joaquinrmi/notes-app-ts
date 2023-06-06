import { NextFunction, Request, Response } from "express";
import checkToken from "../auth/check_token";
import InvalidCredentialsErrorResponse from "../responses/invalid_credentials_error_response";

function useCredentials(req: Request, res: Response, next: NextFunction): void
{
    const authorization = req.get("authorization");
    if(authorization && authorization.toLowerCase().startsWith("bearer "))
    {
        try
        {
            var token = authorization.substring(7);
            var tokenData = checkToken(token);
        }
        catch(err)
        {
            return res.error(new InvalidCredentialsErrorResponse());
        }
    }
    else
    {
        return res.error(new InvalidCredentialsErrorResponse());
    }

    req.credentials = {
        id: tokenData.userId
    };

    next();
}

export default useCredentials;