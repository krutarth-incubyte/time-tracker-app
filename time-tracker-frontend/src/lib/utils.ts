import { Timeblock } from "@/types/timeblocks";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterTimeblocks = (timeblocks: Timeblock[], taskId: number) => {
  return timeblocks.filter((timeblock) => timeblock.taskId === taskId);
};
