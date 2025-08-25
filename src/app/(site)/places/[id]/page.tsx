import { places, findById } from "../../data";

type PageProps = {
  params: Promise<{ id: string }>;
  // (опционально) searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function PlacePage({ params }: PageProps) {
  const { id } = await params; // ← теперь ок
  const place = findById(places, id);

  if (!place) return <div>Place not found</div>;

  return (
    <div>
      <h1>{place.name}</h1>
      <p>{place.address}</p>
    </div>
  );
}