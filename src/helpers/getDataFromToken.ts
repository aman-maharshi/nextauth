import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || ""


    if (!token) {
      return { error: "Token not found" }
    }

    const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!)
   
    /* token from login route.ts
      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
      }
    */

    return decodedToken.id

  } catch (error: any) {
    return { error: error.message }
  } 
}