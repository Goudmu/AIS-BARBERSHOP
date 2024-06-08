import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Component() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Haircut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$25</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Standard Haircut
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$15</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Classic Shave
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Haircut + Shave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$35</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete Grooming
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beard Trim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$10</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Precision Beard Trim
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Facial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$50</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rejuvenating Facial
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manicure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">$20</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Grooming for Hands
                </p>
              </div>
              <Button variant="outline">Book Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
