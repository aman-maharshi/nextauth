import User from "@/models/userModal";
import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"

export const sendMail = async (email: string, emailType: string, userId: string) => {
  try {
    // creating a token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    // saving verifyToken and verifyTokenExpires to the database
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpires: Date.now() + 3600000
      })
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }

    // sending email
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "82d811369ea408",
        pass: "f5cdc9a1896f25"
      }
    });

    const mailOptions = {
      from: 'test@test.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        <br> or <br> copy and paste the link below in your browser.
        <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`,
    }

    const mailResponse = await transporter.sendMail(mailOptions)

    return mailResponse
  } catch (error) {
    console.log("Error sending email: ", error)
  }
}