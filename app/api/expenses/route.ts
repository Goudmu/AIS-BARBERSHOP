import { connectToDB } from "@/mongodb/connect/connect";
import Account, { IAccount } from "@/mongodb/models/Account";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const expensesAccount = await Account.find();
    const filteredExpensesAccount = expensesAccount.filter((data: IAccount) => {
      return ["1", "2", "5"].includes(data.accountID.substring(0, 1));
    });

    return NextResponse.json({ expensesAccount: filteredExpensesAccount });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
