import { connectToDB } from "@/mongodb/connect/connect";
import { NextRequest, NextResponse } from "next/server";
import newGLSchema from "@/mongodb/models/GL";
import Account from "@/mongodb/models/Account";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { description, debits, credits, type, price } = await req.json();
    // VALIDATE INPUT
    if (!description || !debits || !credits || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    console.log(debits);
    console.log(credits);

    // Helper function to update account amounts
    const updateAccountAmount = async (
      _id: string,
      amount: number,
      isDebit: boolean
    ) => {
      const account = await Account.findById({ _id: _id });
      if (!account) {
        throw new Error(`Account with ID ${_id} not found`);
      }

      const balanceType = account.balance;
      let updateAmount = amount;

      if (balanceType === "debit") {
        updateAmount = isDebit ? amount : -amount;
      } else if (balanceType === "credit") {
        updateAmount = isDebit ? -amount : amount;
      }

      const updatedAccount = await Account.findByIdAndUpdate(
        { _id: _id },
        { $inc: { amount: updateAmount } },
        { new: true }
      );

      return updatedAccount;
    };

    // Update account amounts for debits
    await Promise.all(
      debits.map(async (debit: { _id: string; amount: number }) => {
        const updatedAccount = await updateAccountAmount(
          debit._id,
          price,
          true
        );
      })
    );

    // Update account amounts for credits
    await Promise.all(
      credits.map(async (credit: { _id: string; amount: number }) => {
        const updatedAccount = await updateAccountAmount(
          credit._id,
          price,
          false
        );
      })
    );

    // CREATE NEW
    const newEntry = await newGLSchema.create({
      date: new Date(),
      description,
      debits: debits.map((debit: { _id: string; amount: number }) => ({
        accountID: debit._id,
        amount: price,
      })),
      credits: credits.map((credit: { _id: string; amount: number }) => ({
        accountID: credit._id,
        amount: price,
      })),
      type,
    });
    return NextResponse.json({ message: "General Ledger Has Created" });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
