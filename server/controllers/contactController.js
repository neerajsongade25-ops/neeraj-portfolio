const Message = require('../models/Message');
const nodemailer = require('nodemailer');

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save to MongoDB
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Optional: Send email notification (won't fail if credentials missing)
    try {
      if (process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS && process.env.NODEMAILER_PASS !== 'your_app_password_here') {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.NODEMAILER_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New message from ${name}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br/>${message}</p>
          `,
        });
      }
    } catch (emailError) {
      console.log('Email sending failed (non-critical):', emailError.message);
    }

    return res.status(201).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    return res.status(200).json({ success: true, data: msg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    return res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { submitContact, getMessages, markRead, deleteMessage };
