"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { IAccount } from "@/mongodb/models/Account";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NewExpenseState {
  description: string;
  debit?: IAccount;
  name: string;
  price: number;
}

const FormExpenses = () => {
  const [newExpenses, setnewExpenses] = useState<NewExpenseState>({
    description: "",
    debit: undefined,
    name: "",
    price: 0,
  });

  const [accounts, setaccounts] = useState<IAccount[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();

  const getData = async () => {
    const res = await fetch("/api/expenses", { cache: "no-store" });
    const { expensesAccount } = await res.json();
    setaccounts(expensesAccount);
    setisLoading(false);
  };

  useEffect(() => {
    getData();
  }, [isLoading]);

  const handleInputChange = (field: string, value: any) => {
    setnewExpenses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newExpensesJSON = newExpenses;
    newExpensesJSON.debit = accounts.filter(
      (data) => data.name == newExpenses.name
    )[0];
    try {
      const res = await fetch("/api/expenses/book", {
        method: "POST",
        body: JSON.stringify({
          description: newExpenses.description,
          type: "jurnalumum",
          debits: [newExpensesJSON.debit],
          credits: [accounts[0]],
          price: newExpenses.price,
        }),
      });
      if (res.ok) {
        toast({
          title: "Expenses Berhasil Ditambahkan",
        });
        router.push("/jurnalumum");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
    setnewExpenses({
      description: "",
      name: "",
      debit: undefined,
      price: 0,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Form</CardTitle>
        <CardDescription>
          Enter your expenses information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Account Name</Label>
              <Select
                value={newExpenses.name}
                onValueChange={(value) => handleInputChange("name", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {accounts &&
                    accounts.map((data, index) => {
                      return (
                        <SelectItem
                          key={index}
                          value={data.name}
                          id={data.accountID}
                        >
                          {capitalizeFirstLetter(data.name)}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={newExpenses.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newExpenses.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormExpenses;
