//localhost:3000/api/users/signup

import { connectDb } from '@/dbConfig/dbConfig'
import User from "@/models/userModal"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendMail } from '@/helpers/mailer'

connectDb()

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    // console.log(requestBody, "requestBody")
    const { username, email, password } = requestBody
    // TODO: validate username, email, password

    // Register user

    // 1. Check if user already exists
    const userAlreadyExists = await User.findOne({ email })

    if (userAlreadyExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    } else {
      // 2. Hash password
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)

      const user = new User({
        username,
        email,
        password: hashedPassword
      })

      const savedUser = await user.save()
      // console.log(savedUser, "savedUser")

      // 3. Send verification email after user is saved
      await sendMail(email, "VERIFY", savedUser._id)

      return NextResponse.json(
        { message: "User registered successfully", user: savedUser, success: true },
        { status: 201 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}