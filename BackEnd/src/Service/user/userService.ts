import type { Iuser } from "../../Interface/user/user.models.interface.ts";
import type { IuserService } from "./IuserService.ts";
import type { IuserRepository } from "../../Repository/user/IuserRepository.ts";
import { bcryptPassword } from "../../utils/bcrypt.ts";
import { jwtToken } from "../../utils/jwt.ts";
import type { JwtPayload } from "../../utils/jwt.ts";

export class userService implements IuserService {
    private userRepository: IuserRepository;
    private bcryptPassword: bcryptPassword;
    private jwt: jwtToken;

    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository;
        this.bcryptPassword = new bcryptPassword();
        this.jwt = new jwtToken();
    }

    async register(user: Iuser): Promise<Iuser> {
        const userExists = await this.userRepository.findByEmail(user.email);
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await this.bcryptPassword.hashPassword(user.password);
        const userData = { ...user, password: hashedPassword };
        return await this.userRepository.register(userData);
    }

    async login(email: string, password: string): Promise<Iuser | null> {
        const userExists = await this.userRepository.findByEmail(email);
        if (!userExists) {
            throw new Error("User not found");
        }
        const isPasswordValid = await this.bcryptPassword.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        return userExists;
    }

    generateTokens(user: Iuser): { accessToken: string; refreshToken: string } {
        const payload: JwtPayload = {
            id: user._id || "",
            email: user.email,
            role: user.role
        };
        const accessToken = this.jwt.generateAccessToken(payload);
        const refreshToken = this.jwt.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    refreshToken(refreshTokenStr: string): { accessToken: string } {
        const decoded = this.jwt.verifyRefreshToken(refreshTokenStr);
        const payload: JwtPayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        const accessToken = this.jwt.generateAccessToken(payload);
        return { accessToken };
    }
}