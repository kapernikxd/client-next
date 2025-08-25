import { places, findById } from "../../data";

interface PageProps {
  params: { id: string };
}

export default function PlacePage({ params }: PageProps) {
  const place = findById(places, params.id);

  if (!place) {
    return <div>Place not found</div>;
  }

  return (
    <div>
      <h1>{place.name}</h1>
      <p>{place.address}</p>
    </div>
  );
}
