import app from "./src/app.js";
import connectDB from "./src/db/dbconnect.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.error("app caught an error:", error);
        });

        app.listen(PORT, () => {
            console.log(`⚙ Server started at port ${PORT}`);
        });
    });