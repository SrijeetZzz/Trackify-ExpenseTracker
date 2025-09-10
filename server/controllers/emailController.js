import nodemailer from "nodemailer";
import User from "../models/users.js";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email service
  auth: {
    user: process.env.SMTP_USER, // your SMTP email
    pass: process.env.SMTP_PASS, // app password if using Gmail
  },
});

//user-mail-send

export const sendEmail = async (req, res) => {
  const { recipientEmail, subject, message } = req.body;
  const adminEmail = req.user?.email;

  if (!recipientEmail || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipientEmail,
    replyTo: adminEmail || "noreply@trackify.com",
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error sending email." });
  }
};

//gpr-mail-send

export const sendGroupEmails = async (req, res) => {
  const { members, grpName } = req.body;
  const adminEmail = req.user?.email;

  if (!members || members.length === 0 || !grpName) {
    return res.status(400).json({ error: "Missing group data." });
  }

  try {
    const userIds = members.map((m) => m.userId);
    const users = await User.find({ _id: { $in: userIds } });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found for these IDs." });
    }

    const sendPromises = users.map((user) => {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        replyTo: adminEmail,
        subject: `You were added to a new group: ${grpName}`,
        text: `${admin.username} has added you to the group "${grpName}" in Trackify.`,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(sendPromises);

    res.json({
      success: true,
      message: "Emails sent to group members successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send emails." });
  }
};
