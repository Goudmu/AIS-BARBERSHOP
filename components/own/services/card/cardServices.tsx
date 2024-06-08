"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { IService } from "@/mongodb/models/Service";
import FormServices from "../form/formServices";
import { toast } from "@/components/ui/use-toast";

const CardServices = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();

  const getData = async () => {
    const res = await fetch("/api/service", { cache: "no-store" });
    const { services } = await res.json();
    setServices(services);
    setisLoading(false);
  };

  useEffect(() => {
    getData();
  }, [isLoading]);

  const bookHandler = async (data: any) => {
    try {
      const res = await fetch("/api/service/book", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({ title: "Pendapatan Berhasil Ditambahkan" });
        router.push("/jurnalumum");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div>
        <FormServices setisLoading={setisLoading} />
      </div>
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
                      <p className="text-4xl font-bold">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(data.price)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {data.description}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => bookHandler(data)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default CardServices;
