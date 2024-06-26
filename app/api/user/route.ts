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
    const {
      clerkId,
      email,
      username,
      photo,
      role = "barber",
    } = await req.json();
    const user = await User.create({
      clerkId,
      email,
      username,
      photo,
      role,
    });
    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
