"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormJurnalumum from "../form/formJurnalumum";
import React, { useEffect, useState } from "react";
import { IGeneralLedger } from "@/mongodb/models/GL";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function Component() {
  const [ledgerEntries, setledgerEntries] = useState<IGeneralLedger[]>([]);

  const getData = async () => {
    const res = await fetch("/api/generalledger", { cache: "no-store" });
    const { newgeneralLedger, accounts } = await res.json();
    newgeneralLedger.map((dataLedger: IGeneralLedger) => {
      dataLedger.debits.map((dataDebits: any) => {
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataDebits.accountID) {
            dataDebits.accountName = dataAccount.name;
            return;
          }
        });
      });
      dataLedger.credits.map((dataCredits: any) => {
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataCredits.accountID) {
            dataCredits.accountName = dataAccount.name;
            return;
          }
        });
      });
    });
    setledgerEntries(newgeneralLedger);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid gap-8">
      <FormJurnalumum />
      <div className="border rounded-lg overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>General Ledger Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" w-[15%]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[15%] text-center">Debit</TableHead>
                  <TableHead className="w-[15%] text-center">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry, index) => {
                  const entryDate = new Date(entry.date);
                  const formattedDate = `${entryDate.getDate()}-${
                    entryDate.getMonth() + 1
                  }-${entryDate.getFullYear()}`;
                  return (
                    <React.Fragment key={index}>
                      <TableRow key={index}>
                        <TableCell className="py-1">{formattedDate}</TableCell>
                        <TableCell className="py-1 font-bold">
                          {entry.description}
                        </TableCell>
                        <TableCell className="py-1"></TableCell>
                        <TableCell className="py-1"></TableCell>
                      </TableRow>
                      {entry.debits.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1">
                              {capitalizeFirstLetter(data.accountName)}
                            </TableCell>
                            <TableCell className="py-1 text-center">
                              {data.amount}
                            </TableCell>
                            <TableCell className="py-1"></TableCell>
                          </TableRow>
                        );
                      })}
                      {entry.credits.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1">
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {capitalizeFirstLetter(data.accountName)}
                            </TableCell>
                            <TableCell className="py-1"></TableCell>
                            <TableCell className="py-1 text-center">
                              {data.amount}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
