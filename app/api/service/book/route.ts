import { connectToDB } from "@/mongodb/connect/connect";
import { NextRequest, NextResponse } from "next/server";
import newGLSchema from "@/mongodb/models/GL";
import Account from "@/mongodb/models/Account";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { name, price } = await req.json();

    const debits = [{ accountId: "6663ea46c9188bb4b175562e", amount: price }];
    const credits = [{ accountId: "6663f23209c0c2673e89075b", amount: price }];
    const type = "jurnalumum";

    // Update account amounts for debits
    await Promise.all(
      debits.map(async (debit: { accountId: string; amount: number }) => {
        const updatedAccount = await Account.findByIdAndUpdate(
          { _id: debit.accountId },
          { $inc: { amount: debit.amount } },
          { new: true }
        );
      })
    );

    // Update account amounts for credits
    await Promise.all(
      credits.map(async (credit: { accountId: string; amount: number }) => {
        const updatedAccount = await Account.findByIdAndUpdate(
          { _id: credit.accountId },
          { $inc: { amount: credit.amount } },
          { new: true }
        );
      })
    );

    // CREATE NEW
    const newEntry = await newGLSchema.create({
      date: new Date(),
      description: name,
      debits: debits.map((debit: { accountId: string; amount: number }) => ({
        accountID: debit.accountId,
        amount: debit.amount,
      })),
      credits: credits.map((credit: { accountId: string; amount: number }) => ({
        accountID: credit.accountId,
        amount: credit.amount,
      })),
      type,
    });
    return NextResponse.json({ message: "General Ledger Has Created" });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
