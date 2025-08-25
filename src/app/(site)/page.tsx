import Link from "next/link";
import { events } from "./data";

export default function HomePage() {
  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link href={`/event/${event.id}`}>
              {event.title} — {new Date(event.startDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
