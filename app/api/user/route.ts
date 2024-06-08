import { connectToDB } from "@/mongodb/connect/connect";
import User from "@/mongodb/models/User";
import { NextResponse } from "next/server";

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
