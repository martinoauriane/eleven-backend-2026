import { MoodStatus } from "@prisma/client";

export function toMoodStatus(value: any): MoodStatus | undefined {
  if (!value) return undefined;

  if (!Object.values(MoodStatus).includes(value)) {
    throw new Error("Invalid status value");
  }

  return value;
}