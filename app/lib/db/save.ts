import { Predefined } from "../data/Predefined";
import { db } from "./db";

export async function savePredefined(predefined: Predefined): Promise<void> {
  await db.predefined.put(predefined);
}

export async function deletePredefined(id: string): Promise<void> {
  await db.predefined.delete(id);
}

export async function deleteAllPredefined(): Promise<void> {
  await db.predefined.clear();
}

export async function bulkSavePredefined(
  predefined: Predefined[]
): Promise<void> {
  await db.predefined.bulkPut(predefined);
}

export async function getPredefined(): Promise<Predefined[]> {
  return await db.predefined.toArray();
}
