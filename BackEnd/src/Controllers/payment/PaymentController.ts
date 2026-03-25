import type { Request, Response } from "express";
import type { IuserRepository } from "../../Repository/user/IuserRepository.ts";
import { PaymentService } from "../../Service/payment/PaymentService.ts";

export class PaymentController {
    private paymentService: PaymentService;
    private userRepository: IuserRepository;

    constructor(paymentService: PaymentService, userRepository: IuserRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
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

    async verifyWalletTopup(req: Request, res: Response) {
        try {
            const { order_id, payment_id, signature, amount } = req.body;
            const userId = (req as any).user?.id;

            if (!order_id || !payment_id || !signature || !amount || !userId) {
                res.status(400).json({ success: false, message: "Required details missing" });
                return;
            }

            const isVerified = this.paymentService.verifyPayment(order_id, payment_id, signature);

            if (isVerified) {
                // Fetch user details to log more info
                const user = await this.userRepository.findUserById(userId);

                // Update wallet balance in database
                await this.userRepository.updateWalletBalance(userId, amount);
                
                // Log transaction for audit Trail (Admin seeing this later)
                await this.userRepository.createTransaction({
                    userId,
                    userName: user?.name || "Unknown",
                    userEmail: user?.email || "N/A",
                    amount,
                    type: 'topup',
                    paymentMethod: 'razorpay',
                    razorpayOrderId: order_id,
                    razorpayPaymentId: payment_id,
                    status: 'success'
                });

                res.status(200).json({ success: true, message: "Wallet top-up successful" });
            } else {
                res.status(400).json({ success: false, message: "Invalid payment signature" });
            }
        } catch (error: any) {
            console.error("Wallet Topup Verification Error:", error);
            res.status(500).json({ success: false, message: "Verification failed", error: error.message });
        }
    }
}
