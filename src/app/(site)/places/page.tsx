import Link from "next/link";
import { places } from "../data";

export default function PlacesPage() {
  return (
    <div>
      <h1>Places</h1>
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            <Link href={`/places/${place.id}`}>{place.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
