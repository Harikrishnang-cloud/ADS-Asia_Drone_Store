import type { Request, Response } from "express";
import { PaymentService } from "../../Service/payment/PaymentService.ts";

export class PaymentController {
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    async createOrder(req: Request, res: Response) {
        try {
            const { amount } = req.body;
            console.log("Create Order Request - Amount:", amount);
            
            if (!amount) {
                res.status(400).json({ success: false, message: "Amount is required" });
                return;
            }

            const order = await this.paymentService.createOrder(amount);
            console.log("Razorpay Order Created:", order.id);
            res.status(200).json({ success: true, order });
        } catch (error) {
            console.error("Order Creation Error:", error);
            res.status(500).json({ success: false, message: "Order creation failed" });
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { order_id, payment_id, signature } = req.body;
            if (!order_id || !payment_id || !signature) {
                res.status(400).json({ success: false, message: "All payment details are required" });
                return;
            }

            const isVerified = this.paymentService.verifyPayment(order_id, payment_id, signature);

            if (isVerified) {
                res.status(200).json({ success: true, message: "Payment verified successfully" });
            } else {
                res.status(400).json({ success: false, message: "Invalid payment signature" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Verification failed" });
        }
    }
}
