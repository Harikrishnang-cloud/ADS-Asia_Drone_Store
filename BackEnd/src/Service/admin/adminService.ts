import { adminRepository } from "../../Repository/admin/adminRepository.ts";
import type { IadminRepository } from "../../Repository/admin/IadminRepository.ts";
import type { IadminService } from "./IadminService.ts";
import { bcryptPassword } from "../../utils/bcrypt.ts";
import { jwtToken, type JwtPayload } from "../../utils/jwt.ts";

export class adminService implements IadminService {
    private adminRepository: IadminRepository;
    private bcryptPassword: bcryptPassword;
    private jwt: jwtToken;

    constructor() {
        this.adminRepository = new adminRepository();
        this.bcryptPassword = new bcryptPassword();
        this.jwt = new jwtToken();
    }

    async login(email: string, password: string) {
        const user = await this.adminRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("Admin not found");
        }

        if (user.role !== "admin") {
            throw new Error("Access denied: Not an Admin");
        }

        const isPasswordValid = await this.bcryptPassword.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const payload: JwtPayload = {
            id: user._id || "",
            email: user.email,
            role: user.role
        };

        const accessToken = this.jwt.generateAccessToken(payload);
        const refreshToken = this.jwt.generateRefreshToken(payload);

        return { user, tokens: { accessToken, refreshToken } };
    }
}
