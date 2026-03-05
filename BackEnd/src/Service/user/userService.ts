import type { Iuser } from "../../Interface/user/user.models.interface.js";
import type { IuserService } from "./IuserService.js";
import type { IuserRepository } from "../../Repository/user/IuserRepository.js";
import { bcryptPassword } from "../../utils/bcrypt.js";

export class userService implements IuserService {
    private userRepository: IuserRepository;
    private bcryptPassword: bcryptPassword;
    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository;
        this.bcryptPassword = new bcryptPassword();
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
}