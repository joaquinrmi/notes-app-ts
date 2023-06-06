import User from "../../model/user";
import EntityData from "../../repository/entity_data";
import SubordinateUnitOfWork from "../../unit_of_work/subordinate_unit_of_work";
import UnitOfWork from "../../unit_of_work/unit_of_work";
import { decrypt, encrypt } from "../../utils/encrypt";
import ApplicationBookService from "../book/application_book_service";
import CreateUserData from "./data/create_user_data";
import DeleteUserData from "./data/delete_user_data";
import InvalidCredentialsError from "./error/invalid_credentials_error";
import LoginData from "./data/login_data";
import UpdateUserData from "./data/update_user_data";
import UserServiceData from "./data/user_service_data";
import UserDoesNotExistError from "./error/user_does_not_exist_error";
import WrongPasswordError from "./error/wrong_password_error";
import UserService from "./user_service";

class ApplicationUserService implements UserService
{
    private _unitOfWork: UnitOfWork;

    constructor(unitOfWork: UnitOfWork)
    {
        this._unitOfWork = unitOfWork;
    }

    public async login(data: LoginData): Promise<UserServiceData>
    {
        const user = await this._unitOfWork.userRepository.findOne({ email: data.email });
        if(!user || decrypt(user.password) !== data.password)
        {
            throw new InvalidCredentialsError();
        }

        return { id: user.id };
    }

    public async createUser(data: CreateUserData): Promise<void>
    {
        await this._unitOfWork.userRepository.create({
            email: data.email,
            password: encrypt(data.password)
        });

        await this._unitOfWork.saveChanges();
    }

    public async updateUser(data: UpdateUserData): Promise<void>
    {
        const user = await this._unitOfWork.userRepository.getById(data.id);

        if(!user)
        {
            throw new UserDoesNotExistError();
        }

        if(data.currentPassword !== decrypt(user.password))
        {
            throw new WrongPasswordError();
        }

        const updateData: EntityData<User> = {
            id: data.id
        };

        if(data.newEmail)
        {
            updateData.email = data.newEmail;
        }

        if(data.newPassword)
        {
            updateData.password = encrypt(data.newPassword);
        }

        await this._unitOfWork.userRepository.update(updateData);
        await this._unitOfWork.saveChanges();
    }

    public async deleteUser(data: DeleteUserData): Promise<void>
    {
        const user = await this._unitOfWork.userRepository.getById(data.id);
        
        if(!user)
        {
            throw new UserDoesNotExistError();
        }

        if(data.password !== decrypt(user.password))
        {
            throw new InvalidCredentialsError();
        }

        const bookService = new ApplicationBookService(SubordinateUnitOfWork.create(this._unitOfWork));
        
        try
        {
            await bookService.deleteBooksByUser({ userId: data.id });
            await this._unitOfWork.userRepository.delete(data.id);
        }
        catch(err)
        {
            await this._unitOfWork.discardChanges();

            throw err;
        }
        
        await this._unitOfWork.saveChanges();
    }
}

export default ApplicationUserService;