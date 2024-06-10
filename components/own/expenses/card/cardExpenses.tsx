"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AlertConfirm from "../../other/alertConfirm";
import { IAccount } from "@/mongodb/models/Account";

const CardExpenses = () => {
  const [services, setServices] = useState<IAccount[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const getData = async () => {
    const res = await fetch("/api/expenses", { cache: "no-store" });
    const { expensesAccount } = await res.json();
    setServices(expensesAccount);
    setisLoading(false);
  };

  useEffect(() => {
    getData();
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div>{/* <FormServices setisLoading={setisLoading} /> */}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services &&
          services.map((data, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{data.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      {/* <p className="text-4xl font-bold">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(data.price)}
                      </p> */}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {data.name}
                      </p>
                    </div>
                    {/* <AlertConfirm data={data} /> */}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default CardExpenses;
