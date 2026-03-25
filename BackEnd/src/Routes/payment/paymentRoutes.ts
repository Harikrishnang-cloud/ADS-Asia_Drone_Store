import express from "express";
import { PaymentController } from "../../Controllers/payment/PaymentController.ts";
import { authMiddleware } from "../../Middleware/authMiddleware.ts";

export class paymentRoutes {
    private paymentController: PaymentController;
    private paymentRoutes: express.Router;

    constructor(paymentController: PaymentController) {
        this.paymentController = paymentController;
        this.paymentRoutes = express.Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.paymentRoutes.post("/create-order", authMiddleware, (req, res) => {
            this.paymentController.createOrder(req, res);
        });
        
        this.paymentRoutes.post("/verify-payment", authMiddleware, (req, res) => {
            this.paymentController.verifyPayment(req, res);
        });

        this.paymentRoutes.post("/verify-wallet-topup", authMiddleware, (req, res) => {
            this.paymentController.verifyWalletTopup(req, res);
        });
    }

    public getPaymentRoutes() {
        return this.paymentRoutes;
    }
}
