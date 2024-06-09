"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarClockIcon } from "@/lib/icon/icon";
import { CalendarDaysIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  capitalizeFirstLetter,
  formatDateIndo,
  sortAccountsByID,
  stripTime,
} from "@/lib/utils";
import { IGeneralLedger } from "@/mongodb/models/GL";
import { IAccount } from "@/mongodb/models/Account";

export default function Component() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [incomeAccount, setincomeAccount] = useState<IAccount[]>([]);
  const [balanceAccounts, setbalanceAccounts] = useState<IAccount[]>([]);
  const [totalRetainedEarning, settotalRetainedEarning] = useState(0);

  const getDataGeneralLedger = async () => {
    let newtotalDebitledgerEntries = 0;
    let newtotalCreditledgerEntries = 0;
    let newtotalRetainedEarning = 0;

    const res = await fetch("/api/generalledger", { cache: "no-store" });
    const { newgeneralLedger, accounts } = await res.json();

    const res2 = await fetch("/api/account", { cache: "no-store" });
    const { account } = await res2.json();

    const newIncomeAccounts = account.filter((dataAccount: IAccount) => {
      if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
        dataAccount.amount = 0;
        return dataAccount;
      }
    });
    const newBalanceAccounts = account.filter((dataAccount: IAccount) => {
      if (["1", "2", "3"].includes(dataAccount.accountID.substring(0, 1))) {
        dataAccount.amount = 0;
        return dataAccount;
      }
    });

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
    const newgeneralLedgerfilter = newgeneralLedger.filter(
      (dataLedger: IGeneralLedger) => {
        if (!startDate || !endDate) return false;
        const ledgerDate = stripTime(new Date(dataLedger.date));
        const newstartDate = stripTime(new Date(startDate));
        const newendDate = stripTime(new Date(endDate));
        return ledgerDate >= newstartDate && ledgerDate <= newendDate;
      }
    );

    // INCOME STATEMENT
    if (incomeAccount.length != 0) {
      incomeAccount.map((dataAccount: IAccount) => {
        let newAmount = 0;
        newgeneralLedgerfilter.map((dataLedger: IGeneralLedger) => {
          dataLedger.debits.map((dataDebit) => {
            if (dataDebit.accountID == dataAccount._id) {
              if (["4"].includes(dataAccount.accountID.substring(0, 1))) {
                newAmount -= dataDebit.amount;
                newtotalRetainedEarning -= dataDebit.amount;
              } else {
                newAmount += dataDebit.amount;
                newtotalRetainedEarning -= dataDebit.amount;
              }
            }
          });
          dataLedger.credits.map((dataCredits) => {
            if (dataCredits.accountID == dataAccount._id) {
              if (["4"].includes(dataAccount.accountID.substring(0, 1))) {
                newAmount += dataCredits.amount;
                newtotalRetainedEarning += dataCredits.amount;
              } else {
                newAmount -= dataCredits.amount;
                newtotalRetainedEarning += dataCredits.amount;
              }
            }
          });
        });
        dataAccount.amount = newAmount;
        return dataAccount;
      });
    }
    // BALANCE SHEET
    if (balanceAccounts.length != 0) {
      balanceAccounts.map((dataAccount: IAccount) => {
        let newAmount = 0;
        newgeneralLedgerfilter.map((dataLedger: IGeneralLedger) => {
          dataLedger.debits.map((dataDebit) => {
            if (dataDebit.accountID == dataAccount._id) {
              if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
                newAmount += dataDebit.amount;
              } else {
                newAmount -= dataDebit.amount;
              }
            }
          });
          dataLedger.credits.map((dataCredits) => {
            if (dataCredits.accountID == dataAccount._id) {
              if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
                newAmount -= dataCredits.amount;
              } else {
                newAmount += dataCredits.amount;
              }
            }
          });
          dataAccount.amount = newAmount;
          return dataAccount;
        });
      });
      balanceAccounts.map((dataAccount: IAccount) => {
        if (dataAccount.accountID == "3200") {
          dataAccount.amount += newtotalRetainedEarning;
          return dataAccount;
        } else {
          return dataAccount;
        }
      });
    }

    if (incomeAccount.length == 0) {
      setincomeAccount(newIncomeAccounts);
    } else if (incomeAccount.length > 0) {
      setincomeAccount(incomeAccount);
    }
    if (balanceAccounts.length == 0) {
      setbalanceAccounts(newBalanceAccounts);
    } else if (balanceAccounts.length > 0) {
      setbalanceAccounts(balanceAccounts);
    }
    settotalRetainedEarning(newtotalRetainedEarning);
  };

  useEffect(() => {
    getDataGeneralLedger();
  }, []);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };

  const formatDate = (date: Date | undefined): string => {
    return date ? date.toLocaleDateString() : "Select Date";
  };

  const submitHandler = () => {
    getDataGeneralLedger();
  };

  if (incomeAccount.length == 0 || balanceAccounts.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-xl">
          Financial Statements
        </h1>
        {/* DATE CHANGE */}
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarClockIcon className="mr-2 h-4 w-4" />
                {startDate ? formatDate(startDate) : "Start Date"} -{" "}
                {endDate ? formatDate(endDate) : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDate(startDate) : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      selected={startDate}
                      onSelect={handleStartDateChange}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {endDate ? formatDate(endDate) : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      selected={endDate}
                      onSelect={handleEndDateChange}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={submitHandler}>Submit</Button>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* INCOME STATEMENT */}
          <Card>
            <CardHeader>
              <CardTitle>Income Statement</CardTitle>
              <CardDescription>
                {`For the period started at ${formatDateIndo(
                  startDate
                )} and ended ${formatDateIndo(endDate)}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  {incomeAccount &&
                    incomeAccount.map((dataAccount, index) => {
                      if (
                        ["4", "5"].includes(
                          dataAccount.accountID.substring(0, 1)
                        )
                      ) {
                        return (
                          <div className="flex justify-between" key={index}>
                            <span>
                              {capitalizeFirstLetter(dataAccount.name)}
                            </span>
                            <span>
                              {new Intl.NumberFormat("id", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(dataAccount.amount)}
                            </span>
                          </div>
                        );
                      }
                    })}
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between font-semibold">
                    <span>Net Income</span>
                    <span>
                      {new Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(totalRetainedEarning)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* BALANCE SHEET */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet</CardTitle>
              <CardDescription>{`For the period started at ${formatDateIndo(
                startDate
              )} and ended ${formatDateIndo(endDate)}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <div className=" font-bold">
                    <span>ASSET</span>
                  </div>
                  {balanceAccounts &&
                    balanceAccounts.map((dataAccount, index) => {
                      if (
                        ["1"].includes(dataAccount.accountID.substring(0, 1))
                      ) {
                        return (
                          <div key={index} className="flex justify-between">
                            <span>
                              {capitalizeFirstLetter(dataAccount.name)}
                            </span>
                            <span>
                              {new Intl.NumberFormat("id", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(dataAccount.amount)}
                            </span>
                          </div>
                        );
                      }
                    })}
                  <div className="flex justify-between font-bold">
                    <span>TOTAL ASSET</span>
                    <span>
                      {new Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(
                        balanceAccounts.reduce((total, dataAccount) => {
                          if (
                            ["1"].includes(
                              dataAccount.accountID.substring(0, 1)
                            )
                          ) {
                            return (total += dataAccount.amount);
                          }
                          return total;
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-8 justify-between">
                  {/* LIABILITIES */}
                  <div className="flex flex-col">
                    <div className=" font-bold">
                      <span>LIABILITIES</span>
                    </div>
                    {balanceAccounts &&
                      balanceAccounts.map((dataAccount, index) => {
                        if (
                          ["2"].includes(dataAccount.accountID.substring(0, 1))
                        ) {
                          return (
                            <div key={index} className="flex justify-between">
                              <span>
                                {capitalizeFirstLetter(dataAccount.name)}
                              </span>
                              <span>
                                {new Intl.NumberFormat("id", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(dataAccount.amount)}
                              </span>
                            </div>
                          );
                        }
                      })}
                    <div className="flex justify-between font-bold">
                      <span>TOTAL LIABILITIES</span>
                      <span>
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          balanceAccounts.reduce((total, dataAccount) => {
                            if (
                              ["2"].includes(
                                dataAccount.accountID.substring(0, 1)
                              )
                            ) {
                              return (total += dataAccount.amount);
                            }
                            return total;
                          }, 0)
                        )}
                      </span>
                    </div>
                  </div>
                  {/* EQUITIES */}
                  <div className="flex flex-col">
                    <div className=" font-bold">
                      <span>EQUITY</span>
                    </div>
                    {balanceAccounts &&
                      balanceAccounts.map((dataAccount, index) => {
                        if (
                          ["3"].includes(dataAccount.accountID.substring(0, 1))
                        ) {
                          if (dataAccount.accountID == "3200") {
                            return (
                              <div key={index} className="flex justify-between">
                                <span>
                                  {capitalizeFirstLetter(dataAccount.name)}
                                </span>
                                <span>
                                  {new Intl.NumberFormat("id", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                  }).format(dataAccount.amount)}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={index} className="flex justify-between">
                              <span>
                                {capitalizeFirstLetter(dataAccount.name)}
                              </span>
                              <span>
                                {new Intl.NumberFormat("id", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(dataAccount.amount)}
                              </span>
                            </div>
                          );
                        }
                      })}
                    <div className="flex justify-between font-bold">
                      <span>TOTAL EQUITY</span>
                      <span>
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(
                          balanceAccounts.reduce((total, dataAccount) => {
                            if (
                              ["3"].includes(
                                dataAccount.accountID.substring(0, 1)
                              )
                            ) {
                              return (total += dataAccount.amount);
                            }
                            return total;
                          }, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
