import nodemailer from "nodemailer"

export const sendMail = async (email: string, emailType: string, userId: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOptions = {
      from: 'test@test.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: "<b>Hello world?</b>",
    }

    const mailResponse = await transporter.sendMail(mailOptions)

    return mailResponse
  } catch (error) {
    console.log("Error sending email: ", error)
  }
}