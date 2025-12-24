import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

const globalWithMongoose = global as typeof global & {
  _mongoose?: Promise<typeof mongoose>;
};

export const connectDb = async (): Promise<typeof mongoose> => {
  if (globalWithMongoose._mongoose) return globalWithMongoose._mongoose;
  const { MONGODB_URI } = getEnv();
  globalWithMongoose._mongoose = mongoose.connect(MONGODB_URI);
  return globalWithMongoose._mongoose;
};
