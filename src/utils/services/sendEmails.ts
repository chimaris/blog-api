import nodemailer from "nodemailer";

// email setting
const MAIL_SETTINGS = {
	service: "gmail",
	auth: {
		user: process.env.MAIL_EMAIL,
		pass: process.env.MAIL_PASSWORD,
	},
};

export const sendResetPasswordToken = async (email: string, resetToken: string) => {
	const transporter = nodemailer.createTransport(MAIL_SETTINGS);

	// Construct the email
	const mailOptions = {
		from: MAIL_SETTINGS.auth.user,
		to: email,
		subject: "Reset Password",
		text: `Click the following link to reset your password: http://localhost:5000/reset-password?token=${resetToken}`,
	};

	// Send the email
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: ", info.response);
	} catch (error) {
		console.error("Error sending email: ", error);
	}
};
