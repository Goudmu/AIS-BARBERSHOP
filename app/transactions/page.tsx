import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CheckIcon } from "@/lib/icon/icon";

export default function Component() {
  const bookings = [
    {
      id: 1,
      customer: "John Doe",
      service: "Haircut",
      date: "2023-06-01",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Shave",
      date: "2023-06-02",
      time: "2:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Bob Johnson",
      service: "Haircut + Shave",
      date: "2023-06-03",
      time: "9:30 AM",
      status: "Pending",
    },
    {
      id: 4,
      customer: "Sarah Lee",
      service: "Beard Trim",
      date: "2023-06-04",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      id: 5,
      customer: "Michael Brown",
      service: "Facial",
      date: "2023-06-05",
      time: "3:30 PM",
      status: "Pending",
    },
    {
      id: 6,
      customer: "Emily Davis",
      service: "Manicure",
      date: "2023-06-06",
      time: "1:00 PM",
      status: "Pending",
    },
  ];
  const completedServices = [
    {
      id: 1,
      customer: "John Doe",
      service: "Haircut",
      date: "2023-06-01",
      time: "10:30 AM",
      price: 25,
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Shave",
      date: "2023-06-02",
      time: "2:15 PM",
      price: 15,
    },
    {
      id: 3,
      customer: "Bob Johnson",
      service: "Haircut + Shave",
      date: "2023-06-03",
      time: "9:45 AM",
      price: 35,
    },
    {
      id: 4,
      customer: "Sarah Lee",
      service: "Beard Trim",
      date: "2023-06-04",
      time: "11:20 AM",
      price: 10,
    },
    {
      id: 5,
      customer: "Michael Brown",
      service: "Facial",
      date: "2023-06-05",
      time: "4:00 PM",
      price: 50,
    },
    {
      id: 6,
      customer: "Emily Davis",
      service: "Manicure",
      date: "2023-06-06",
      time: "1:30 PM",
      price: 20,
    },
  ];
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon">
                        <CheckIcon className="h-4 w-4" />
                        <span className="sr-only">Complete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.customer}</TableCell>
                    <TableCell>{service.service}</TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>{service.time}</TableCell>
                    <TableCell>${service.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
