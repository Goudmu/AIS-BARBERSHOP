import { connectToDB } from "@/mongodb/connect/connect";
import Account, { IAccount } from "@/mongodb/models/Account";
import { NextRequest, NextResponse } from "next/server";
import newGLSchema, { IGeneralLedger } from "@/mongodb/models/GL";

export const GET = async () => {
  try {
    await connectToDB();
    const generalLedger = await newGLSchema.find({ type: "jurnalpenyesuaian" });
    const accounts = await Account.find();
    const newgeneralLedger = generalLedger;

    return NextResponse.json({ newgeneralLedger, accounts });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
