import { connectToDB } from "@/mongodb/connect/connect";
import Account from "@/mongodb/models/Account";
import newGLSchema from "@/mongodb/models/GL";
import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req: NextRequest) => {
//   const url = new URL(req.url);
//   const idAccount = new URLSearchParams(url.searchParams).get("id")?.valueOf();
//   try {
//     await connectToDB();
//     if (idAccount == "" || idAccount == undefined) {
//       const account = await Account.find();
//       return NextResponse.json({ account });
//     } else {
//       const account = await Account.find({ _id: idAccount });
//       return NextResponse.json({ account });
//     }
//   } catch (error: any) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

export const GET = async () => {
  try {
    await connectToDB();
    const generalLedger = await newGLSchema.find({ type: "jurnalumum" });
    const adjustLedger = await newGLSchema.find({ type: "jurnalpenyesuaian" });
    const accounts = await Account.find();
    return NextResponse.json({ generalLedger, adjustLedger, accounts });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
