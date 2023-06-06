import ApplicationController from "../controller/application_controller";
import useError from "../middlewares/use_error";
import useSubmit from "../middlewares/use_submit";
import useServices from "../middlewares/use_services";
import useUnitOfWork from "../middlewares/use_unit_of_work";
import UserController from "./user";
import BookController from "./book";
import NoteController from "./note";
import AuthController from "./auth";

class APIController extends ApplicationController
{
    constructor()
    {
        super();
    }

    protected override registerRoutes(): void
    {
        this.router.use([ useSubmit, useError ]);

        this.router.use(useUnitOfWork);
        this.router.use(useServices);

        const userController = new UserController();
        const bookController = new BookController();
        const noteController = new NoteController();
        const authController = new AuthController();

        this.router.use("/user", userController.use());
        this.router.use("/book", bookController.use());
        this.router.use("/note", noteController.use());
        this.router.use("/auth", authController.use());
    }
}

export default APIController;