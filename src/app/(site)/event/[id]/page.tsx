import Image from "next/image";
import { events, findById } from "../../data";

interface PageProps {
  params: { id: string };
}

export default function EventPage({ params }: PageProps) {
  const event = findById(events, params.id);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{new Date(event.startDate).toLocaleString()}</p>
      <p>{event.description}</p>
      <p>{event.address}</p>
      <div>
        {event.images.map((src) => (
          <Image key={src} src={src} alt={event.title} width={200} height={200} />
        ))}
      </div>
    </div>
  );
}
