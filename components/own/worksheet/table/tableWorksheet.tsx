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
  const [trigger, setTrigger] = useState(false);

  const getDataAccount = async () => {
    const res = await fetch("/api/account?id=", { cache: "no-store" });
    const { account } = await res.json();
    setAccounts(sortAccountsByID(account));
  };

  const getDataGeneralLedger = async () => {
    let newtotalDebitledgerEntries = 0;
    let newtotalCreditledgerEntries = 0;
    const res = await fetch("/api/generalledger", { cache: "no-store" });
    const { newgeneralLedger, accounts } = await res.json();
    newgeneralLedger.map((dataLedger: IGeneralLedger) => {
      dataLedger.debits.map((dataDebits: any) => {
        newtotalDebitledgerEntries += dataDebits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataDebits.accountID) {
            dataDebits.accountName = dataAccount.name;
            return;
          }
        });
      });
      dataLedger.credits.map((dataCredits: any) => {
        newtotalCreditledgerEntries += dataCredits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataCredits.accountID) {
            dataCredits.accountName = dataAccount.name;
            return;
          }
        });
      });
    });
    newgeneralLedger.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    settotalDebitledgerEntries(newtotalCreditledgerEntries);
    settotalCreditledgerEntries(newtotalCreditledgerEntries);
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
                <TableHead className="text-center" colSpan={2}>
                  Jurnal Umum
                </TableHead>
                <TableHead className="text-center" colSpan={2}>
                  Jurnal Penyesuaian
                </TableHead>
                <TableHead className="text-center" colSpan={2}>
                  Laporan Laba Rugi
                </TableHead>
                <TableHead className="text-center" colSpan={2}>
                  Laporan Penutup
                </TableHead>
                <TableHead className="text-center" colSpan={2}>
                  Neraca
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
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
                  return (
                    <TableRow key={index}>
                      <TableCell className="py-1 border">
                        {dataAccount.accountID}
                      </TableCell>
                      <TableCell className="py-1 border">
                        {capitalizeFirstLetter(dataAccount.name)}
                      </TableCell>
                      {ledgerEntries &&
                        ledgerEntries.map((dataGE, index) => {
                          let debitAmount = 0;
                          let creditAmount = 0;
                          dataGE.debits.map((dataGEDebit) => {
                            if (dataAccount._id == dataGEDebit.accountID) {
                              debitAmount += dataGEDebit.amount;
                            }
                          });
                          dataGE.credits.map((dataGECredit) => {
                            if (dataAccount._id == dataGECredit.accountID) {
                              creditAmount += dataGECredit.amount;
                            }
                          });
                          return (
                            <React.Fragment>
                              <TableCell className="py-1 border px-1">
                                {new Intl.NumberFormat("id", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(debitAmount)}
                              </TableCell>
                              <TableCell className="py-1 border px-1">
                                {new Intl.NumberFormat("id", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(creditAmount)}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className=" text-right">
                  TOTAL
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalDebitledgerEntries)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalCreditledgerEntries)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
