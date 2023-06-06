import { Request, Response } from "express";
import ApplicationController from "../../controller/application_controller";
import useInput from "../../middlewares/use_input";
import useInputDefinition from "../../middlewares/use_input_definition";
import { Validation } from "../../validation";
import LoginForm from "./data/login_form";
import ModelError from "../../../repository/error/model_error";
import InvalidCredentialsError from "../../../services/user/error/invalid_credentials_error";
import InvalidCredentialsErrorResponse from "../../responses/invalid_credentials_error_response";
import DBError from "../../../repository/error/db_error";
import InternalServerErrorResponse from "../../responses/internal_server_error_response";
import OkResponse from "../../responses/ok_response";
import generateToken from "../../auth/generate_token";

class AuthController extends ApplicationController
{
    constructor()
    {
        super();
    }

    protected override registerRoutes(): void
    {
        this.router.route("/")
            .post([
                useInputDefinition<LoginForm>(
                    "body",
                    {
                        email: {
                            validator: Validation.isEmail(),
                            errorMessage: "The email is invalid."
                        },
                        password: {
                            validator: Validation.isString(),
                            errorMessage: "The password must be a string."
                        }
                    }
                ),
                useInput<LoginForm>("loginForm"),
                this.login
            ])
    }

    private async login(req: Request, res: Response): Promise<void>
    {
        try
        {
            const { id } = await req.userService.login(req.loginForm);
            var token = generateToken({ id });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case InvalidCredentialsError.name:
                return res.error(new InvalidCredentialsErrorResponse());

            case DBError.name:
            default:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new OkResponse({ token }));
    }
}

export default AuthController;