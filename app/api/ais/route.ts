import { NextResponse } from "next/server";
import MistralClient from "@mistralai/mistralai";
import Account, { IAccount } from "@/mongodb/models/Account";

const instructionMessage = {
  role: "user",
  content:
    "I have accounting information system and I have this array of accounts ['cash','Account Receivables', 'Inventory', 'Equipment','Prive','Retained earning','Rent','Utilities','Wages', 'accounts Payable', 'owner's Equity', 'haircut Revenue']. First, learning about concept of accounting. I want you to return an array of object based on general ledger when i give you a prompt. For example, the prompt is 'modal awal perusahaan adalah 300.000', return [ { 'name': 'kas', 'debit': 300000, 'credit': 0 }, { 'name': 'modal', 'debit': 0, 'credit': 300000 } ]. Another example : the prompt is 'membayar utang 100.000', return [ { 'name': 'kas', 'debit': 0, 'credit': 100000 }, { 'name': 'utang', 'debit': 100000, 'credit': 0 } ]. The prompt is 'pendapatan hari ini 300.000', return [ { 'name': 'kas', 'debit': 0, 'credit': 300000 }, { 'name': 'pendapatan', 'debit': 300000, 'credit': 0 } ]. Another prompt is 'pendapatan hari ini 500.000'. Return [ { 'name': 'kas', 'debit': 500000, 'credit': 0 }, { 'name': 'pendapatan', 'debit': 0, 'credit': 500000 } ]. Return the array on JSON. Got it ? Here's the accounts and their default type. ",
};

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are null", { status: 400 });
    }

    const accounts = await Account.find();
    let conceptOfAccount = "[";
    accounts.map((dataAcc: IAccount) => {
      conceptOfAccount += `{name : ${dataAcc.name}, type : ${dataAcc.balance}}, `;
    });
    conceptOfAccount += "]. ";

    const chatResponse = await client.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content:
            instructionMessage.content + conceptOfAccount + messages.content,
        },
      ],
    });

    return NextResponse.json(chatResponse.choices[0].message.content);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// const openai = new OpenAI({
//   apiKey: process.env.PUBLIC_OPENAI_API_KEY,
//   baseURL: "https://api.pawan.krd/gpt-3.5-unfiltered/v1",
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { messages } = body;

//     if (!messages) {
//       return new NextResponse("Messages are null", { status: 400 });
//     }

//     const res = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [instructionMessage, ...messages],
//     });

//     return NextResponse.json(res.choices[0].message);
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }