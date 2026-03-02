require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 RATE LIMIT (Prevents Spam Attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per window
});
app.use("/contact", limiter);

// ✅ CONNECT DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 📩 MESSAGE SCHEMA
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    status: { type: String, default: "Unread" },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

// 📧 EMAIL TRANSPORT
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==============================
// CONTACT ROUTE (Advanced)
// ==============================

app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 🛑 Basic Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // 💾 Save to Database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        // 📩 Send Email to School
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Website Message",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });

        // 📤 Auto Reply to Sender
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "We Received Your Message",
            text: `Hello ${name},\n\nThank you for contacting Cornerstone Leadership Academy. We will respond shortly.\n\nRegards,\nSchool Administration`
        });

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ==============================
// ADMIN ROUTES
// ==============================

// 📄 Get All Messages
app.get("/admin/messages", async (req, res) => {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
});

// ✔ Mark Message as Read
app.put("/admin/messages/:id", async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, { status: "Read" });
    res.json({ success: true });
});

// ❌ Delete Message
app.delete("/admin/messages/:id", async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ==============================

app.listen(5000, () => console.log("Advanced Server Running on port 5000"));
