//localhost:3000/api/users/logout

import { connectDb } from '@/dbConfig/dbConfig'
import { NextRequest, NextResponse } from "next/server"

connectDb()

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'User logged out successfully',
      success: true,

    })

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0)
    })

    return response

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}