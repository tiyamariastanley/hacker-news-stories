export const getRandomIdArray = (data: number[], count: number) => {
  const result = new Set<number>();
  while (result.size < count && result.size < data.length) {
    const index = Math.floor(Math.random() * data.length);
    result.add(data[index]);
  }
  return Array.from(result);
};
