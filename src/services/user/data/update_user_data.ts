interface UpdateUserData
{
    id: number;
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
}

export default UpdateUserData;