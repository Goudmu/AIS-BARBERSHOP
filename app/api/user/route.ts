import { connectToDB } from "@/mongodb/connect/connect";
import User from "@/mongodb/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const user = await User.find();
    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { username, password, photo = "", role = "admin" } = await req.json();
    const user = await User.create({
      username,
      password,
      photo,
      role,
    });
    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
