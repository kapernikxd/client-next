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
      <p>{event.date}</p>
    </div>
  );
}
