import Image from "next/image";
import { events, findById } from "../../data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: PageProps) {
  const { id } = await params; // 👈 important
  const event = findById(events, id);

  if (!event) return <div>Event not found</div>;

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
