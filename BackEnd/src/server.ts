import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./Routes/user/userRoutes.ts";
import { userController } from "./Controllers/user/userControllers.ts";
import { userRepository } from "./Repository/user/userRepository.ts";
import { userService } from "./Service/user/userService.ts";
import { authRoutes } from "./Routes/auth.routes.ts";
import { adminRoutes } from "./Routes/admin/adminRoutes.ts";
import { paymentRoutes } from "./Routes/payment/paymentRoutes.ts";
import { PaymentController } from "./Controllers/payment/PaymentController.ts";
import { PaymentService } from "./Service/payment/PaymentService.ts";
import { reviewRoutes } from "./Routes/review/reviewRoutes.ts";

const app = express();

const FRONTEND_URLS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://asiadronestore.online",
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = FRONTEND_URLS.includes(origin) || 
                         origin.includes('localhost') || origin.includes("asiadronestore.online") ||
                         origin.includes('127.0.0.1');

        if (isAllowed || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(express.json());
app.use(cookieParser());

const userRepo = new userRepository();
const userSvc = new userService(userRepo);
const userCtrl = new userController(userSvc);
const userRouter = new userRoutes(userCtrl);

const authRouter = new authRoutes();

app.use("/", userRouter.getUserRoutes());
app.use("/auth", authRouter.getAuthRoutes());

const adminRouter = new adminRoutes();
app.use("/admin", adminRouter.getAdminRoutes());

const paymentSvc = new PaymentService();
const paymentCtrl = new PaymentController(paymentSvc, userRepo);
const paymentRouter = new paymentRoutes(paymentCtrl);
app.use("/payment", paymentRouter.getPaymentRoutes());

const reviewRouter = new reviewRoutes();
app.use("/reviews", reviewRouter.getReviewRoutes());

import { supportRoutes } from "./Routes/support/supportRoutes.ts";
const supportRouter = new supportRoutes();
app.use("/support", supportRouter.getSupportRoutes());


const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});