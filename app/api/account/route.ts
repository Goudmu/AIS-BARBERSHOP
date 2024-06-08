import { connectToDB } from "@/mongodb/connect/connect";
import Account from "@/mongodb/models/Account";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const account = await Account.find();
    return NextResponse.json({ account });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { accountID, name, balance, amount } = await req.json();
    const account = await Account.create({ accountID, name, balance, amount });
    return NextResponse.json({ account });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { _id } = await req.json();
    const account = await Account.findOneAndDelete({ _id });
    return NextResponse.json({ account });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
