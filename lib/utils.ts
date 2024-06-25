import { IAccount } from "@/mongodb/models/Account";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  if (string == undefined) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortAccountsByID(accounts: IAccount[]): IAccount[] {
  return accounts.sort((a, b) => a.accountID.localeCompare(b.accountID));
}

export const uuidToId = (uuid: any) => {
  const hash = uuid.split("-").join("");
  return parseInt(hash.substr(0, 8), 16);
};

export const formatDateIndo = (date: Date | undefined): string => {
  if (!date) return "Select Date";
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export function extractJSONArray(inputString: string) {
  // Define a regular expression to match JSON array structure
  const jsonRegex = /\[([\s\S]*?)\]/;

  // Find the JSON array within the inputString using the regular expression
  const match = inputString.match(jsonRegex);

  if (match && match.length > 0) {
    // Extract the matched JSON array
    const jsonArrayString = match[0];

    try {
      // Parse the JSON array string into an actual JavaScript array
      const jsonArray = JSON.parse(jsonArrayString);
      return jsonArray;
    } catch (error) {
      console.error("Error parsing JSON array:", error);
      return null;
    }
  } else {
    console.error("JSON array not found in input string.");
    return null;
  }
}
