//localhost:3000/api/users/profile

import { connectDb } from '@/dbConfig/dbConfig'
import User from "@/models/userModal"
import { NextRequest, NextResponse } from "next/server"
import { getDataFromToken } from "@/helpers/getDataFromToken"

connectDb()


// get user information 
// - already sent token to user 
// - extract id from token and request backend with that id to get user information
export async function GET(request: NextRequest) {
  try {

    // extract data from token
    const userId = await getDataFromToken(request) // await - we dont want to preceed until we get the data from token

    const user = await User.findOne({ _id: userId }).select("-password") // dont want password

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "User found",
      data: user
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}