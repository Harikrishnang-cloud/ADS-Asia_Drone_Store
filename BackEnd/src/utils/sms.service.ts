
export const sendResetOTPSMS = async (name: string, phone: string, otp: string) => {
    console.log(`To: ${phone}`);
    console.log(`Recipient Name: ${name}`);
    console.log(`Message: Your Asia Drone Store verification code is ${otp}. Valid for 5 minutes.`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return true;
};
