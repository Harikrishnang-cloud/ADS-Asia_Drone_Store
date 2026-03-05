import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});