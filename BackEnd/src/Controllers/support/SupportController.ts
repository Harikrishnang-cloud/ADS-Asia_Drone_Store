import type { Request, Response } from "express";
import db from "../../Config/config.firebase.ts";

export class SupportController {
    // ---- CONTACT ----
    async submitContact(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, subject, message } = req.body;
            
            if (!name || !email || !message) {
                res.status(400).json({ success: false, message: "Name, email, and message are required" });
                return;
            }

            const newContactRef = db.collection("contacts").doc();
            await newContactRef.set({
                id: newContactRef.id,
                name,
                email,
                subject: subject || "",
                message,
                status: "unread",
                createdAt: new Date().toISOString()
            });

            res.status(201).json({ success: true, message: "Contact details submitted successfully" });
        } catch (error: any) {
            console.error("Submit contact error:", error);
            res.status(500).json({ success: false, message: "Failed to submit contact details" });
        }
    }

    async getContacts(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection("contacts").orderBy("createdAt", "desc").get();
            const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            res.status(200).json({ success: true, contacts });
        } catch (error: any) {
            console.error("Fetch contacts error:", error);
            res.status(500).json({ success: false, message: "Failed to fetch contacts" });
        }
    }

    // ---- NEWSLETTER ----
    async subscribeNewsletter(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            
            if (!email) {
                res.status(400).json({ success: false, message: "Email is required" });
                return;
            }

            // Check if already subscribed
            const existing = await db.collection("newsletters").where("email", "==", email).get();
            if (!existing.empty) {
                res.status(400).json({ success: false, message: "Email already subscribed" });
                return;
            }

            const newSubscriptionRef = db.collection("newsletters").doc();
            await newSubscriptionRef.set({
                id: newSubscriptionRef.id,
                email,
                status: "active",
                subscribedAt: new Date().toISOString()
            });

            res.status(201).json({ success: true, message: "Subscribed successfully" });
        } catch (error: any) {
            console.error("Subscribe newsletter error:", error);
            res.status(500).json({ success: false, message: "Failed to subscribe to newsletter" });
        }
    }

    async getNewsletters(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection("newsletters").orderBy("subscribedAt", "desc").get();
            const subscriptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            res.status(200).json({ success: true, subscriptions });
        } catch (error: any) {
            console.error("Fetch newsletters error:", error);
            res.status(500).json({ success: false, message: "Failed to fetch newsletters" });
        }
    }
}
