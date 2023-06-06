import App from "../app";
import express from "express";
import initializeModel from "../model/initialize_model";
import APIController from "../routes/api/api_controller";

class NotesApp implements App
{
    private _port: number;
    private _app: express.Application;

    constructor()
    {
        this._app = express();
        this._port = Number(process.env.PORT);
    }

    public async start(): Promise<void>
    {
        try
        {
            await this.initialize();
            await this.runServer();
        }
        catch(err)
        {
            console.error(err);
            return;
        }

        console.log(`Server on port ${this._port}.`);
    }

    private async initialize(): Promise<void>
    {
        await initializeModel();

        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));

        const apiController = new APIController();

        this._app.use("/api", apiController.use());
    }

    private runServer(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this._app.listen(this._port, resolve)
                .on("error", reject);
        });
    }
}

export default NotesApp;