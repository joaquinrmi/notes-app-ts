import { Response } from "express";
import HttpStatusCode from "../http_status_code";

class APIResponse
{
    private httpStatusCode: HttpStatusCode;
    private content: any;

    constructor(httpStatusCode: HttpStatusCode, content?: any)
    {
        this.httpStatusCode = httpStatusCode;
        this.content = content;
    }

    emit(res: Response): void
    {
        if(this.content && Object.keys(this.content).length === 0)
        {
            res.status(this.httpStatusCode).send();
        }
        else
        {
            res.status(this.httpStatusCode).json(this.content);
        }
    }
}

export default APIResponse;