import { NextFunction, Request, Response } from "express";
import MiddlewareFunction from "./middleware_function";
import If from "../../conditional/if";
import Extends from "../../conditional/extends";
import RequestDefinition from "../../@types/express/request_definition";

function useInput<T>(target: keyof {[Key in keyof RequestDefinition]: If<RequestDefinition[Key], Extends<RequestDefinition[Key], T>>}): MiddlewareFunction
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        req[target] = req.rawInput;

        next();
    }
}

export default useInput;