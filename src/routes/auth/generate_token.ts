import jwt from "jsonwebtoken";
import TokenData from "./token_data";

function generateToken(userData: { id: number }): string
{
    const tokenData: TokenData = {
        userId: userData.id,
    };

    const token = jwt.sign(
        tokenData,
        process.env.TOKEN_SECRET
    );

    return token;
}

export default generateToken;