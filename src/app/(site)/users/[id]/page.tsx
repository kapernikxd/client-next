import { users, findById } from "../../data";

interface PageProps {
  params: { id: string };
}

export default function UserPage({ params }: PageProps) {
  const user = findById(users, params.id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
