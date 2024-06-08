import { connectToDB } from "@/mongodb/connect/connect";
import Account from "@/mongodb/models/Account";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const idAccount = new URLSearchParams(url.searchParams).get("id")?.valueOf();
  try {
    await connectToDB();
    if (idAccount == "" || idAccount == undefined) {
      const account = await Account.find();
      return NextResponse.json({ account });
    } else {
      const account = await Account.find({ _id: idAccount });
      return NextResponse.json({ account });
    }
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
