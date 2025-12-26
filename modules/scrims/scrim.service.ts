import { connectDb } from "@/lib/db";
import { ScrimModel } from "@/models/Scrim.model";
import { PaymentModel } from "@/models/Payment.model";
import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { ScrimMap } from "@/enums/ScrimMap.enum";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";

const withDefaults = (scrim: Scrim): Scrim => ({
  ...scrim,
  map: scrim.map ?? ScrimMap.ERANGEL,
  availableSlots: scrim.availableSlots ?? scrim.maxSlots,
});

export const listScrims = async (): Promise<Scrim[]> => {
  await connectDb();
  const scrims = await ScrimModel.find().sort({ startTime: 1 }).lean<Scrim>();
  return scrims.map(withDefaults);
};

export const getScrimBySlug = async (slug: string): Promise<Scrim | null> => {
  await connectDb();
  const scrim = await ScrimModel.findOne({ slug }).lean<Scrim>();
  if (scrim) return withDefaults(scrim);
  // Fallback: allow lookup by id string
  const byId = await ScrimModel.findById(slug).lean<Scrim>();
  return byId ? withDefaults(byId) : null;
};

export const createScrim = async (payload: Scrim): Promise<Scrim> => {
  await connectDb();
  const scrim = await ScrimModel.create(payload);
  return scrim.toObject();
};

export const markScrimFullIfNeeded = async (scrimId: string): Promise<void> => {
  await connectDb();
  const paymentCount = await PaymentModel.countDocuments({ scrimId, status: PaymentStatus.SUCCESS });
  const scrim = await ScrimModel.findById(scrimId);
  if (!scrim) return;
  if (paymentCount >= scrim.maxSlots && scrim.status !== ScrimStatus.FULL) {
    scrim.status = ScrimStatus.FULL;
    await scrim.save();
  }
};

export const joinScrim = async (scrimId: string, userId: string, paymentId?: string) => {
  await connectDb();
  const scrim = await ScrimModel.findById(scrimId);
  if (!scrim) throw new Error("Scrim not found");
  if (scrim.status === ScrimStatus.FULL) throw new Error("Scrim full");

  const existing = await PaymentModel.findOne({ scrimId, userId });
  if (existing && existing.status === PaymentStatus.SUCCESS) {
    throw new Error("User already joined");
  }

  if (paymentId) {
    await PaymentModel.findByIdAndUpdate(paymentId, { status: PaymentStatus.SUCCESS });
  }

  await markScrimFullIfNeeded(scrimId);
  return scrim.toObject();
};
