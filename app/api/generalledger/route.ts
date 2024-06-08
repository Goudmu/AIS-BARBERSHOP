import { connectToDB } from "@/mongodb/connect/connect";
import Account, { IAccount } from "@/mongodb/models/Account";
import { NextRequest, NextResponse } from "next/server";
import newGLSchema, { IGeneralLedger } from "@/mongodb/models/GL";

export const GET = async () => {
  try {
    await connectToDB();
    const generalLedger = await newGLSchema.find();
    const accounts = await Account.find();
    const newgeneralLedger = generalLedger;

    return NextResponse.json({ newgeneralLedger, accounts });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { date, description, debits, credits } = await req.json();
    // VALIDATE INPUT
    if (!date || !description || !debits || !credits) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // CREATE NEW
    const newEntry = await newGLSchema.create({
      date: new Date(date),
      description,
      debits: debits.map((debit: { accountId: string; amount: number }) => ({
        accountID: debit.accountId,
        amount: debit.amount,
      })),
      credits: credits.map((credit: { accountId: string; amount: number }) => ({
        accountID: credit.accountId,
        amount: credit.amount,
      })),
    });
    return NextResponse.json({ message: "General Ledger Has Created" });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { _id } = await req.json();
    const deleteGeneralLedger = await newGLSchema.findByIdAndDelete({ _id });
    return NextResponse.json({ message: "General Ledger Has Deleted" });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
