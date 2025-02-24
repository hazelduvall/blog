import { getCollection } from "astro:content";

export const getPhotography = async () => {
  const entries = await getCollection("photography");

  const photography = entries.map((entry) => ({
    ...entry.data,
    entry,
    id: entry.id,
  }));

  // Reverse chronological order
  photography.sort((pageA, pageB) => pageB.date - pageA.date);
  return photography;
};
