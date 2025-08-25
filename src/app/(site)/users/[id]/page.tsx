import { users, findById } from "../../data";

type PageProps = {
  params: Promise<{ id: string }>;
  // при желании:
  // searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;            // 👈 важно
  const user = findById(users, id);

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
