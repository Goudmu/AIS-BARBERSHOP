import { IAccount } from "@/mongodb/models/Account";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortAccountsByID(accounts: IAccount[]): IAccount[] {
  return accounts.sort((a, b) => a.accountID.localeCompare(b.accountID));
}
