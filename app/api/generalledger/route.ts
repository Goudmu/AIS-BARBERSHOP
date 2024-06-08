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

    // Helper function to update account amounts
    const updateAccountAmount = async (
      accountId: string,
      amount: number,
      isDebit: boolean
    ) => {
      const account = await Account.findById({ _id: accountId });
      if (!account) {
        throw new Error(`Account with ID ${accountId} not found`);
      }

      const balanceType = account.balance;
      let updateAmount = amount;

      if (balanceType === "debit") {
        updateAmount = isDebit ? amount : -amount;
      } else if (balanceType === "credit") {
        updateAmount = isDebit ? -amount : amount;
      }

      const updatedAccount = await Account.findByIdAndUpdate(
        { _id: accountId },
        { $inc: { amount: updateAmount } },
        { new: true }
      );

      return updatedAccount;
    };

    // Update account amounts for debits
    await Promise.all(
      debits.map(async (debit: { accountId: string; amount: number }) => {
        const updatedAccount = await updateAccountAmount(
          debit.accountId,
          debit.amount,
          true
        );
      })
    );

    // Update account amounts for credits
    await Promise.all(
      credits.map(async (credit: { accountId: string; amount: number }) => {
        const updatedAccount = await updateAccountAmount(
          credit.accountId,
          credit.amount,
          false
        );
      })
    );

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

    // Fetch the general ledger entry to be deleted
    const ledgerEntry = await newGLSchema.findById(_id);
    if (!ledgerEntry) {
      return NextResponse.json(
        { message: "General Ledger entry not found" },
        { status: 404 }
      );
    }

    // Helper function to update account amounts
    const updateAccountAmount = async (
      accountID: string,
      amount: number,
      isDebit: boolean
    ) => {
      const account = await Account.findById(accountID);
      if (!account) {
        throw new Error(`Account with ID ${accountID} not found`);
      }

      const balanceType = account.balance;
      let updateAmount = amount;

      if (balanceType === "debit") {
        updateAmount = isDebit ? -amount : amount;
      } else if (balanceType === "credit") {
        updateAmount = isDebit ? amount : -amount;
      }

      const updatedAccount = await Account.findByIdAndUpdate(
        accountID,
        { $inc: { amount: updateAmount } },
        { new: true }
      );

      return updatedAccount;
    };

    // Update account amounts for debits
    await Promise.all(
      ledgerEntry.debits.map(
        async (debit: { accountID: string; amount: number }) => {
          const updatedAccount = await updateAccountAmount(
            debit.accountID,
            debit.amount,
            true
          );
        }
      )
    );

    // Update account amounts for credits
    await Promise.all(
      ledgerEntry.credits.map(
        async (credit: { accountID: string; amount: number }) => {
          const updatedAccount = await updateAccountAmount(
            credit.accountID,
            credit.amount,
            false
          );
        }
      )
    );

    // Delete the general ledger entry
    await newGLSchema.findByIdAndDelete(_id);

    return NextResponse.json({
      message: "General Ledger entry has been deleted",
    });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
