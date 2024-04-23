//localhost:3000/api/users/verifyemail

import { connectDb } from '@/dbConfig/dbConfig'
import User from "@/models/userModal"
import { NextRequest, NextResponse } from "next/server"

connectDb()

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()

    const { token } = requestBody
    console.log(token, "verify email token")

    if (token) {
      // 1. Find user with the token and token expiry
      const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() } // should be greater than Date.now()
      })

      if (!user) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        )
      }

      // 2. If user is found, update the user's isVerified field to true and remove the verifyToken and verifyTokenExpiry fields
      user.isVerified = true
      user.verifyToken = undefined
      user.verifyTokenExpiry = undefined

      const savedUser = await user.save()
      console.log(savedUser, "savedUser after email verification")

      return NextResponse.json(
        { message: "Email verified successfully", success: true },
        { status: 200 }
      )

    }

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}