import { notFound } from "next/navigation";
import { ScrimDetailsCard } from "@/components/scrims/ScrimDetailsCard";
import { getScrimBySlug } from "@/modules/scrims/scrim.service";

const ScrimDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const scrim = await getScrimBySlug(params.slug);
  if (!scrim) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ScrimDetailsCard scrim={scrim} />
    </div>
  );
};

export default ScrimDetailsPage;
