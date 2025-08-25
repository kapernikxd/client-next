export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  address: string;
  images: string[];
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
  {
    id: "65d37f9c0e0aef59bfa09038",
    title: "Бал в Белграде",
    description:
      "Приглашаем вас на незабываемый вечер! Живая музыка, танцы и фото-зона для волшебных снимков.",
    startDate: "2025-08-31T15:00:00.000Z",
    address:
      "Imperium Hall, Кеј на Ади Хуји, Београд, Централна Србија, 11060, Србија",
    images: ["/vercel.svg"],
  },
  {
    id: "1",
    title: "Belgrade Jazz Night",
    description:
      "Вечер живой джазовой музыки с участием лучших музыкантов города.",
    startDate: "2025-09-10T18:00:00.000Z",
    address: "Jazz Club, Београд",
    images: ["/next.svg"],
  },
  {
    id: "2",
    title: "Art Expo 2025",
    description:
      "Выставка современного искусства с работами молодых сербских художников.",
    startDate: "2025-10-05T10:00:00.000Z",
    address: "Expo Center, Нови Београд",
    images: ["/globe.svg"],
  },
  {
    id: "3",
    title: "Danube Marathon",
    description:
      "Марафон вдоль Дуная для любителей бега всех уровней подготовки.",
    startDate: "2025-04-20T07:00:00.000Z",
    address: "Дунайская набережная, Београд",
    images: ["/file.svg"],
  },
  {
    id: "4",
    title: "Serbian Food Fair",
    description:
      "Фестиваль традиционной кухни с дегустациями и мастер-классами от шеф-поваров.",
    startDate: "2025-11-12T12:00:00.000Z",
    address: "Трг Републике, Београд",
    images: ["/window.svg"],
  },
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
