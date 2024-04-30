//localhost:3000/api/users/login

import { connectDb } from '@/dbConfig/dbConfig'
import User from "@/models/userModal"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connectDb()

export async function POST(request: NextRequest) {
  try {

    const requestBody = await request.json()
    // console.log(requestBody, "requestBody")
    const { email, password } = requestBody

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      )
    }

    console.log(user, "user")

    const validPassword = bcryptjs.compareSync(password, user.password)

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      )
    }

    // if user found and password is valid -  create jwt token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })


    const response = NextResponse.json({
      message: 'User logged in successfully',
      success: true,
    })

    response.cookies.set('token', token, {
      httpOnly: true // user can't change the cookie in borwser
    })

    return response

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}