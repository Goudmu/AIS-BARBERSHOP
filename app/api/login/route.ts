import { connectToDB } from "@/mongodb/connect/connect";
import User from "@/mongodb/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { username, password } = await req.json();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User Not Found" });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: "Wrong Password" });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
