import { razorpayInstance } from "../../Config/razorpay.ts";
import crypto from "crypto";
import "dotenv/config";

export class PaymentService {
    async createOrder(amount: number) {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise, rounded to avoid float issues
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        try {
            const order = await razorpayInstance.orders.create(options);
            return order;
        } catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw new Error("Razorpay order creation failed");
        }
    }

    verifyPayment(orderId: string, paymentId: string, signature: string) {
        const secret = process.env.RAZORPAY_KEY_SECRET || "";
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(`${orderId}|${paymentId}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === signature) {
            return true;
        } else {
            return false;
        }
    }
}
