/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LEdiOdVE5kv
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { IAccount } from "@/mongodb/models/Account";
import { capitalizeFirstLetter } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function TableAccountComponent() {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [newAccount, setNewAccount] = useState({
    accountID: "",
    name: "",
    balance: "debit",
    amount: 0,
  });

  const getData = async () => {
    const res = await fetch("/api/account", { cache: "no-store" });
    const { account } = await res.json();
    setAccounts(account);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (e: any) => {
    setNewAccount({
      ...newAccount,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        body: JSON.stringify(newAccount),
      });
      if (res.ok) {
        getData();
        toast({
          title: "Akun Berhasil Ditambahkan",
        });
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
    setNewAccount({
      accountID: "",
      name: "",
      balance: "debit",
      amount: 0,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* FORM */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Add New Account ?</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Accounting Form</CardTitle>
                <CardDescription>
                  Enter your account information below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountID">Account ID</Label>
                      <Input
                        id="accountID"
                        name="accountID"
                        type="text"
                        value={newAccount.accountID}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={newAccount.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Debit/Credit</Label>
                      <Select
                        id="balance"
                        name="balance"
                        value={newAccount.balance}
                        onValueChange={(e: any) =>
                          setNewAccount({
                            ...newAccount,
                            balance: e,
                          })
                        }
                      >
                        <SelectTrigger id="balance">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debit" id="debit">
                            Debit
                          </SelectItem>
                          <SelectItem value="credit" id="credit">
                            Credit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Add Account</Button>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Debit/Credit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Edit / Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell className=" py-1">{account.accountID}</TableCell>
                  <TableCell className=" py-1">
                    {capitalizeFirstLetter(account.name)}
                  </TableCell>
                  <TableCell className=" py-1">
                    {capitalizeFirstLetter(account.balance)}
                  </TableCell>
                  <TableCell className=" py-1">
                    ${account.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className=" py-1"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
