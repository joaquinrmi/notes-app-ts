import CreateUserData from "./data/create_user_data";
import DeleteUserData from "./data/delete_user_data";
import LoginData from "./data/login_data";
import UpdateUserData from "./data/update_user_data";
import UserServiceData from "./data/user_service_data";

interface UserService
{
    login(data: LoginData): Promise<UserServiceData>;
    createUser(data: CreateUserData): Promise<void>;
    updateUser(data: UpdateUserData): Promise<void>;
    deleteUser(data: DeleteUserData): Promise<void>;
}

export default UserService;