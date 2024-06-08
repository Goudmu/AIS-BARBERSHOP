"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { TrashIcon } from "@/lib/icon/icon";
import { useRouter } from "next/navigation";

export default function AlertConfirm({ data }: any) {
  const router = useRouter();

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
  return (
    <div className="flex justify-end ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="default">
            Book Now
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to confirm?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently confirm the
              selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bookHandler(data)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
