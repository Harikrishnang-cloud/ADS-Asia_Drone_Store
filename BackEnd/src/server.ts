import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRoutes } from "./Routes/user/userRoutes.ts";
import { userController } from "./Controllers/user/userControllers.ts";
import { userRepository } from "./Repository/user/userRepository.ts";
import { userService } from "./Service/user/userService.ts";
import { authRoutes } from "./Routes/auth.routes.ts";
import { adminRoutes } from "./Routes/admin/adminRoutes.ts";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const userRepo = new userRepository();
const userSvc = new userService(userRepo);
const userCtrl = new userController(userSvc);
const userRouter = new userRoutes(userCtrl);


const authRouter = new authRoutes();

app.use("/", userRouter.getUserRoutes());
app.use("/auth", authRouter.getAuthRoutes());

const adminRouter = new adminRoutes();
app.use("/admin", adminRouter.getAdminRoutes());


const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});