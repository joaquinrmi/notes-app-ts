import express from "express";
import Controller from "./controller";

class ApplicationController implements Controller
{
    private _router: express.Router;

    protected get router()
    {
        return this._router;
    }

    constructor()
    {
        this._router = express.Router();
    }

    public use(): express.Router
    {
        this.registerRoutes();

        return this._router;
    }

    protected registerRoutes(): void
    {
        return;
    }
}

export default ApplicationController;