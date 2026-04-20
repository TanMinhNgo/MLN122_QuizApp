// Example model — replace with actual DB logic (e.g. Mongoose, Prisma, etc.)

export interface ExampleItem {
  id: number;
  name: string;
  createdAt: Date;
}

// In-memory store as placeholder
const items: ExampleItem[] = [
  { id: 1, name: 'Item 1', createdAt: new Date() },
  { id: 2, name: 'Item 2', createdAt: new Date() },
];

export const ExampleModel = {
  findAll: (): ExampleItem[] => items,

  findById: (id: number): ExampleItem | undefined =>
    items.find((item) => item.id === id),

  create: (name: string): ExampleItem => {
    const newItem: ExampleItem = {
      id: items.length + 1,
      name,
      createdAt: new Date(),
    };
    items.push(newItem);
    return newItem;
  },
};
