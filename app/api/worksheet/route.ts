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
