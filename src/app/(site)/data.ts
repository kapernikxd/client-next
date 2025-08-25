export interface Event {
  id: string;
  title: string;
  date: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const events: Event[] = [
  { id: "1", title: "Conference", date: "2025-05-01" },
  { id: "2", title: "Workshop", date: "2025-06-15" },
];

export const places: Place[] = [
  { id: "1", name: "Main Hall", address: "123 Main St" },
  { id: "2", name: "Expo Center", address: "456 Market St" },
];

export const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

export const findById = <T extends { id: string }>(collection: T[], id: string) =>
  collection.find((item) => item.id === id);
