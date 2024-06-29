import { connectToDB } from "@/mongodb/connect/connect";
import Account, { IAccount } from "@/mongodb/models/Account";
import newGLSchema, { IGeneralLedger } from "@/mongodb/models/GL";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const generalLedger = await newGLSchema.find({ type: "jurnalumum" });
    const adjustLedger = await newGLSchema.find({ type: "jurnalpenyesuaian" });
    const accounts = await Account.find();

    // CLOSINSG LEDGER
    const closingLedgerAccounts = accounts.filter((dataAccount: IAccount) => {
      if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
        return dataAccount;
      } else if (["3"].includes(dataAccount.accountID.substring(0, 1))) {
        if (dataAccount.accountID == "3100") {
          return dataAccount;
        }
      }
    });
    const closingLedger = generalLedger.filter((data: IGeneralLedger) => {
      let exist = false;
      closingLedgerAccounts.map((dataAccount: any) => {
        data.debits.map((dataDebit) => {
          if (dataAccount._id.toString() == dataDebit.accountID) {
            exist = true;
          }
        });
        data.credits.map((dataCredit) => {
          if (dataAccount._id.toString() == dataCredit.accountID) {
            exist = true;
          }
        });
      });
      if (exist) {
        return data;
      }
    });
    return NextResponse.json({
      generalLedger,
      adjustLedger,
      accounts,
      closingLedger,
    });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
