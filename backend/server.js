require("dotenv").config();

const path = require("path");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    const mode = process.env.NODE_ENV || "development";
    console.log(`Server running in ${mode} mode on port ${PORT}`);
    console.log(`App + API: http://localhost:${PORT}`);
    console.log(`Login:       http://localhost:${PORT}/login.html`);
    console.log(`Health:      http://localhost:${PORT}/health`);
    console.log(`Frontend:    ${path.join(__dirname, "..", "frontend")}`);
});

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
