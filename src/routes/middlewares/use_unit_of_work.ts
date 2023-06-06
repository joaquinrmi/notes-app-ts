import { NextFunction, Request, Response } from "express";
import ApplicationUnitOfWork from "../../unit_of_work/application_unit_of_work";
import InternalServerErrorResponse from "../responses/internal_server_error_response";

const useUnitOfWork = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const appUnitOfWork = new ApplicationUnitOfWork();
        await appUnitOfWork.initialize();

        req.unitOfWork = appUnitOfWork;
    }
    catch(err)
    {
        console.log(err);
        return res.error(new InternalServerErrorResponse());
    }

    next();
};

export default useUnitOfWork;