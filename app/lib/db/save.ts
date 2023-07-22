import { Predefined } from "../data/Predefined";
import { db } from "./db";

export async function savePredefined(predefined: Predefined): Promise<void> {
  await db.predefined.put(predefined);
}

export async function getPredefined(): Promise<Predefined[]> {
  return await db.predefined.toArray();
}
