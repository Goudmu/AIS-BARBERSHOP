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
export default function Component() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">27</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3,456</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-06-01</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Haircut</TableCell>
                  <TableCell>$25.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-02</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Shave</TableCell>
                  <TableCell>$15.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-03</TableCell>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>Haircut + Shave</TableCell>
                  <TableCell>$35.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-04</TableCell>
                  <TableCell>Alice Williams</TableCell>
                  <TableCell>Haircut</TableCell>
                  <TableCell>$25.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-05</TableCell>
                  <TableCell>Tom Davis</TableCell>
                  <TableCell>Beard Trim</TableCell>
                  <TableCell>$10.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
