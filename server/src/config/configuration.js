require("dotenv").config();
module.exports = {
    GMAIL: {
        USER: process.env.GMAIL_USER || "",
        PASS: process.env.GMAIL_PASS || ""  
    }
}