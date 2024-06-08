"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { IGeneralLedger } from "@/mongodb/models/GL";
import { capitalizeFirstLetter, sortAccountsByID } from "@/lib/utils";
import { IAccount } from "@/mongodb/models/Account";

export default function WorksheetTableComponent() {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [ledgerEntries, setledgerEntries] = useState<IGeneralLedger[]>([]);
  const [totalDebitledgerEntries, settotalDebitledgerEntries] = useState(0);
  const [totalCreditledgerEntries, settotalCreditledgerEntries] = useState(0);
  const [totalDebitledgerAdjust, settotalDebitledgerAdjust] = useState(0);
  const [totalCreditledgerAdjust, settotalCreditledgerAdjust] = useState(0);
  const [totalDebitReportRL, settotalDebitReportRL] = useState(0);
  const [totalCreditReportRL, settotalCreditReportRL] = useState(0);
  const [totalDebitNeraca, settotalDebitNeraca] = useState(0);
  const [totalCreditNeraca, settotalCreditNeraca] = useState(0);
  const [totalCreditRetainedEarning, settotalCreditRetainedEarning] =
    useState(0);
  const [trigger, setTrigger] = useState(false);

  const getDataAccount = async () => {
    const res = await fetch("/api/account?id=", { cache: "no-store" });
    const { account } = await res.json();
    setAccounts(sortAccountsByID(account));
  };

  const getDataGeneralLedger = async () => {
    let newtotalDebitledgerEntries = 0;
    let newtotalCreditledgerEntries = 0;
    let newtotalDebitReportRL = 0;
    let newtotalCreditReportRL = 0;
    let newtotalDebitNeraca = 0;
    let newtotalCreditNeraca = 0;

    const res = await fetch("/api/generalledger", { cache: "no-store" });
    const { newgeneralLedger, accounts } = await res.json();
    newgeneralLedger.map((dataLedger: IGeneralLedger) => {
      dataLedger.debits.map((dataDebits: any) => {
        newtotalDebitledgerEntries += dataDebits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataDebits.accountID) {
            if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitReportRL += dataDebits.amount;
            } else if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitNeraca += dataDebits.amount;
            } else if (
              ["2", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalCreditNeraca -= dataDebits.amount;
            }
            dataDebits.accountName = dataAccount.name;
            return;
          }
        });
      });
      dataLedger.credits.map((dataCredits: any) => {
        newtotalCreditledgerEntries += dataCredits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataCredits.accountID) {
            if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalCreditReportRL += dataCredits.amount;
            } else if (
              ["2", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalCreditNeraca += dataCredits.amount;
            } else if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitNeraca -= dataCredits.amount;
            }
            dataCredits.accountName = dataAccount.name;
            return;
          }
        });
      });
    });

    // ADD RETAINED EARNING TO NERACA
    newtotalCreditNeraca += newtotalCreditReportRL - newtotalDebitReportRL;

    settotalDebitledgerEntries(newtotalDebitledgerEntries);
    settotalCreditledgerEntries(newtotalCreditledgerEntries);
    settotalDebitReportRL(newtotalDebitReportRL);
    settotalCreditReportRL(newtotalCreditReportRL);
    settotalCreditRetainedEarning(
      newtotalCreditReportRL - newtotalDebitReportRL
    );
    settotalDebitNeraca(newtotalDebitNeraca);
    settotalCreditNeraca(newtotalCreditNeraca);
    setledgerEntries(newgeneralLedger);
  };

  useEffect(() => {
    getDataGeneralLedger();
    getDataAccount();
  }, [trigger]);

  return (
    <div className="border rounded-lg overflow-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle>Work Sheet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" w-[10%]">Account ID</TableHead>
                <TableHead className=" w-[10%]">Name Account</TableHead>
                <TableHead className="text-center w-[18%]" colSpan={2}>
                  Jurnal Umum
                </TableHead>
                <TableHead className="text-center w-[18%]" colSpan={2}>
                  Jurnal Penyesuaian
                </TableHead>
                <TableHead className="text-center w-[18%]" colSpan={2}>
                  Laporan Laba Rugi
                </TableHead>
                <TableHead className="text-center w-[18%]" colSpan={2}>
                  Laporan Penutup
                </TableHead>
                <TableHead className="text-center w-[18%]" colSpan={2}>
                  Neraca
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className=" text-center py-1 border"></TableCell>
                <TableCell className=" text-center py-1 border"></TableCell>
                <TableCell className=" text-center py-1 border">
                  Debit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Credit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Debit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Credit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Debit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Credit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Debit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Credit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Debit
                </TableCell>
                <TableCell className=" text-center py-1 border">
                  Credit
                </TableCell>
              </TableRow>
              {accounts &&
                accounts.map((dataAccount, index) => {
                  let debitGLAmount = 0;
                  let creditGLAmount = 0;
                  ledgerEntries.map((dataGE) => {
                    dataGE.debits.map((dataGEDebit) => {
                      if (dataAccount._id == dataGEDebit.accountID) {
                        debitGLAmount += dataGEDebit.amount;
                      }
                    });
                    dataGE.credits.map((dataGECredit) => {
                      if (dataAccount._id == dataGECredit.accountID) {
                        creditGLAmount += dataGECredit.amount;
                      }
                    });
                  });
                  return (
                    <TableRow key={index}>
                      <TableCell className="py-1 border">
                        {dataAccount.accountID}
                      </TableCell>
                      <TableCell className="py-1 border">
                        {capitalizeFirstLetter(dataAccount.name)}
                      </TableCell>
                      {/* GENERAL LEDGER */}
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(debitGLAmount)}
                      </TableCell>
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(creditGLAmount)}
                      </TableCell>
                      {/* ADJUST LEDGER */}
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                      {/* REPORT REVENUE OR LOSS */}
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          ["4", "5"].includes(
                            dataAccount.accountID.substring(0, 1)
                          )
                            ? debitGLAmount
                            : 0
                        )}
                      </TableCell>
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          ["4", "5"].includes(
                            dataAccount.accountID.substring(0, 1)
                          )
                            ? creditGLAmount
                            : 0
                        )}
                      </TableCell>
                      {/* CLOSING LEDGER */}
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                      {/* NERACA */}
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          ["1"].includes(dataAccount.accountID.substring(0, 1))
                            ? debitGLAmount - creditGLAmount
                            : 0
                        )}
                      </TableCell>
                      <TableCell className="py-1 border px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          dataAccount.accountID == "3200"
                            ? totalCreditRetainedEarning
                            : ["2", "3"].includes(
                                dataAccount.accountID.substring(0, 1)
                              )
                            ? creditGLAmount - debitGLAmount
                            : 0
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="py-1 border px-1 text-right">
                  TOTAL
                </TableCell>
                {/* General Ledger */}
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitledgerEntries)}
                </TableCell>
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditledgerEntries)}
                </TableCell>
                {/* Adjusting Ledger */}
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitledgerAdjust)}
                </TableCell>
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditledgerAdjust)}
                </TableCell>
                {/* Report RL */}
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitReportRL)}
                </TableCell>
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditReportRL)}
                </TableCell>
                {/* Closing Ledger */}
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitledgerAdjust)}
                </TableCell>
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditledgerAdjust)}
                </TableCell>
                {/* NERACA */}
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitNeraca)}
                </TableCell>
                <TableCell className="py-1 border px-1 text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditNeraca)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
