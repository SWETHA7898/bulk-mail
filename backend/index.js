// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = ['https://bulk-mail-frontend.onrender.com'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// MongoDB Connection (No .env usage)
mongoose.connect("mongodb+srv://swetha:123@cluster0.h8ebz.mongodb.net/mail?retryWrites=true&w=majority")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

// Email Sending Endpoint
app.post("/sendmail", async (req, res) => {
  try {
    const { msg, email } = req.body;

    // Directly set SMTP credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    // Send emails to all recipients
    const mailPromises = email.map((recipient) =>
      transporter.sendMail({
        from: "your-email@gmail.com",
        to: recipient,
        subject: "A message from bulk mail",
        text: msg,
      })
    );

    await Promise.all(mailPromises);
    console.log("Emails sent successfully");
    res.send(true);

  } catch (error) {
    console.error("Email sending failed:", error);
    res.send(false);
  }
});

// Dynamic Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
