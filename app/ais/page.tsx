"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { formSchema } from "./constans";
import axios from "axios";
import { useRouter } from "next/navigation";
import Typewriter from "typewriter-effect";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn, extractJSONArray, sortAccountsByID } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import Heading from "@/components/own/ais/heading";
import { LoadingComponent } from "@/components/own/ais/loading";
import { IAccount } from "@/mongodb/models/Account";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface NewGLState {
  date: Date;
  description: string;
  accountId: string;
  name: string;
  debitCredit: string;
  amount: number;
}

export default function AISPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [newGL, setnewGL] = useState<NewGLState[]>([
    {
      date: new Date(),
      description: "",
      name: "",
      accountId: "",
      debitCredit: "Debit",
      amount: 0,
    },
    {
      date: new Date(),
      description: "",
      name: "",
      accountId: "",
      debitCredit: "Debit",
      amount: 0,
    },
  ]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const getAccountsData = async () => {
    try {
      const res = await fetch(`/api/account?id=`, {
        cache: "no-store",
      });
      const { account } = await res.json();
      setAccounts(sortAccountsByID(account));
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    getAccountsData();
  }, []);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: `the prompt is "${values.prompt}"`,
      };
      const newMessages = userMessage;

      const res = await axios.post("/api/ais", {
        messages: newMessages,
      });
      let stringReturn = res.data;
      let newGLArray = extractJSONArray(stringReturn);

      newGLArray.map((data: any) => {
        data.date = new Date();
        accounts.map((dataAcc) => {
          if (data.name.toLowerCase() == dataAcc.name.toLowerCase()) {
            data.accountId = dataAcc._id;
          }
        });
        if (data.debit == 0) {
          data.debitCredit = "Credit";
          data.amount = data.credit;
        } else {
          data.debitCredit = "Debit";
          data.amount = data.debit;
        }
        data.description = values.prompt;
      });
      if (newGLArray.error != "Try Again") {
        setnewGL(newGLArray);
      }
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const inputHandler = async () => {
    const debits = newGL.filter((data) => data.debitCredit == "Debit");
    const credits = newGL.filter((data) => data.debitCredit == "Credit");
    const res = await fetch("/api/generalledger", {
      method: "POST",
      body: JSON.stringify({
        date: newGL[0].date,
        description: newGL[0].description,
        debits,
        credits,
        type: "jurnalumum",
      }),
    });
    if (res.ok) {
      toast({ title: "General Ledger Has Created" });
      router.push("/jurnalumum");
      setnewGL([
        {
          date: new Date(),
          description: "",
          accountId: "",
          name: "",
          debitCredit: "Debit",
          amount: 0,
        },
      ]);
    }
  };
  return (
    <div className=" flex flex-col gap-5">
      <div>
        <Heading
          title="Accounting Information System Integrated with Artificial Intelligence"
          description="V.1.0.0"
          icon={Settings2}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
        <div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                autoComplete="off"
              >
                <FormField
                  name="prompt"
                  render={({ field }: any) => (
                    <FormItem className=" col-span-12 lg:col-span-10">
                      <FormControl className=" m-0 p-0">
                        <Input
                          disabled={isLoading}
                          placeholder="Give me today's transaction"
                          {...field}
                          className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className=" col-span-12 md:col-span-2 w-full"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className=" space-y-4 mt-10">
            {isLoading && (
              <div className=" p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <LoadingComponent />
              </div>
            )}
            <div className=" flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => {
                if (message.content != undefined) {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-8 w-full flex items-start gap-x-8 rounded-lg",
                        message.role === "user"
                          ? "bg-white border border-black/10"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "user" ? (
                        <p className=" text-sm">{String(message.content)}</p>
                      ) : (
                        <Typewriter
                          options={{
                            strings: String(message.content),
                            autoStart: true,
                            delay: 10,
                          }}
                        />
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Card>
          <CardContent>
            <div className="grid gap-4 mt-5">
              <h2 className="text-2xl font-bold">General Ledger</h2>
              <div className="grid gap-4">
                {newGL.map((entry, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor={`accName-${entry.name}`}>
                        Account Name
                      </Label>
                      <Input
                        id={`accName-${entry.name}`}
                        type="text"
                        value={entry.name}
                        disabled
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`amount-${entry.debitCredit}`}>
                        Debit/Credit
                      </Label>
                      <Input
                        id={`amount-${entry.debitCredit}`}
                        type="text"
                        value={entry.debitCredit}
                        disabled
                      />
                    </div>
                    <div className=" space-y-1">
                      <div className="space-y-1">
                        <Label htmlFor={`amount-${entry.name}`}>Amount</Label>
                        <div className=" flex gap-3">
                          <div>
                            <Input
                              id={`amount-${entry.name}`}
                              type="number"
                              value={entry.amount}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className=" text-end">
                  <Button onClick={inputHandler}>Input General Ledger</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
