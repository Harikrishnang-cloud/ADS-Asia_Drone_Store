import transporter from "../Config/config.nodemailer.ts";

export const sendResetOTPEmail = async (name: string, email: string, otp: string) => {
    console.log(`Sending OTP Email to: ${email}`);
    console.log(`OTP Code generated is: ${otp}`);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,

            subject: "Password Reset OTP - Asia Drone Store",
            text: `Your OTP is ${otp}.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1e293b;">Password Reset OTP from The Team ADS</h2>
                    <p>Hello, ${name}</p>
                    <p>We received a request to reset the password for your Asia Drone Store account.</p>
                    <div style="background-color: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
                    </div>
                    <p><strong>This OTP will expire in 5 minutes.</strong></p>
                    <p style="color: #64748b; font-size: 14px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">The Team ADS(Asia Drone Store)</p>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
