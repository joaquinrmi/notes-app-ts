import { Request, Response } from "express";
import ApplicationController from "../../controller/application_controller";
import useInput from "../../middlewares/use_input";
import useInputDefinition from "../../middlewares/use_input_definition";
import { Validation } from "../../validation";
import CreateUserForm from "./data/create_user_form";
import DBError from "../../../repository/error/db_error";
import ModelError from "../../../repository/error/model_error";
import InternalServerErrorResponse from "../../responses/internal_server_error_response";
import CreatedResponse from "../../responses/created_response";
import useCredentials from "../../middlewares/use_credentials";
import UpdateUserForm from "./data/update_user_form";
import UserDoesNotExistError from "../../../services/user/error/user_does_not_exist_error";
import WrongPasswordError from "../../../services/user/error/wrong_password_error";
import WrongPasswordResponse from "./response/wrong_password_response";
import NoContentResponse from "../../responses/no_content_response";
import OkResponse from "../../responses/ok_response";
import DeleteUserForm from "./data/delete_user_form";
import InvalidCredentialsError from "../../../services/user/error/invalid_credentials_error";
import InvalidCredentialsErrorResponse from "../../responses/invalid_credentials_error_response";

class UserController extends ApplicationController
{
    constructor()
    {
        super();
    }

    protected override registerRoutes(): void
    {
        this.router.route("/")
            .post([
                useInputDefinition<CreateUserForm>(
                    "body",
                    {
                        email: {
                            validator: Validation.isEmail(),
                            errorMessage: "The email is invalid."
                        },
                        password: {
                            validator: Validation.isString().minLength(8),
                            errorMessage: "The password must have at least 8 characters."
                        }
                    }
                ),
                useInput<CreateUserForm>("createUserForm"),
                this.createUser
            ])
            .patch([
                useCredentials,
                useInputDefinition<UpdateUserForm>(
                    "body",
                    {
                        currentPassword: {
                            validator: Validation.isString(),
                            errorMessage: "The password must be a string."
                        },
                        newEmail: {
                            validator: Validation.optional(Validation.isEmail()),
                            errorMessage: "The email is invalid."
                        },
                        newPassword: {
                            validator: Validation.optional(Validation.isString().minLength(8)),
                            errorMessage: "The password must have at least 8 characters."
                        }
                    }
                ),
                useInput<UpdateUserForm>("updateUserForm"),
                this.updateUser
            ])
            .delete([
                useCredentials,
                useInputDefinition<DeleteUserForm>(
                    "body",
                    {
                        password: {
                            validator: Validation.isString(),
                            errorMessage: "The password must be a string."
                        }
                    }
                ),
                useInput<DeleteUserForm>("deleteUserForm"),
                this.deleteUser
            ])
    }

    private async createUser(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.userService.createUser(req.createUserForm);
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case DBError.name:
            default:
                console.log(ModelError.Message(err));
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new CreatedResponse());
    }

    private async updateUser(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.userService.updateUser({
                id: req.credentials.id,
                ...req.updateUserForm
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case UserDoesNotExistError.name:
                return res.error(new InternalServerErrorResponse());

            case WrongPasswordError.name:
                return res.error(new WrongPasswordResponse());

            case DBError.name:
            default:
                console.log(ModelError.Message(err));
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new NoContentResponse());
    }

    private async deleteUser(req: Request, res: Response): Promise<void>
    {
        try
        {
            await req.userService.deleteUser({
                id: req.credentials.id,
                password: req.deleteUserForm.password
            });
        }
        catch(err)
        {
            switch(ModelError.Name(err))
            {
            case InvalidCredentialsError.name:
                return res.error(new InvalidCredentialsErrorResponse());

            case DBError.name:
            default:
                console.log(ModelError.Message(err));
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new OkResponse());
    }
}

export default UserController;