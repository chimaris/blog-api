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
		html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
					body {
						font-family: "Arial", sans-serif;
						background-color: #f4f4f4;
						margin: 0;
						padding: 0;
						text-align: center;
					}

					.container {
						max-width: 600px;
						margin: 50px auto;
						padding: 20px;
						background-color: #fff;
						border-radius: 5px;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
					}

					h1 {
						color: #333;
					}

					p {
						color: #555;
					}

					.button {
						display: inline-block;
						padding: 10px 20px;
						font-size: 16px;
						text-decoration: none;
						background-color: #007bff;
						color: #fff;
						border-radius: 5px;
						transition: background-color 0.3s;
					}

					.button:hover {
						background-color: #0056b3;
					}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Password Reset</h1>
                    <p>Click the following link to reset your password:</p>
                    <a class="button" href="http://localhost:5000/api/v1/user/reset-password/${resetToken}" target="_blank">Reset Password</a>
                </div>
            </body>
            </html>
        `,
	};

	// Send the email
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: ", info.response);
	} catch (error) {
		console.error("Error sending email: ", error);
		return error;
	}
};
