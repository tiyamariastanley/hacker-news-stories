import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import type { Story } from "../../types/story";
import StoryCard from "./StoryCard";
import Loader from "../loader";
import "./stories.scss";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getRandomIdArray = (data: number[], count: number) => {
  const result = new Set<number>();
  while (result.size < count && result.size < data.length) {
    const index = Math.floor(Math.random() * data.length);
    result.add(data[index]);
  }
  return Array.from(result);
};

const Stories = () => {
  const { data, error, isLoading } = useSWR<number[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    fetcher,
    { revalidateOnFocus: false }
  );

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStories = useCallback(async (ids: number[]) => {
    setLoading(true);
    try {
      const storyPromises = ids.map((id) =>
        fetcher(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const fetchedStories: Story[] = await Promise.all(storyPromises);
      setStories(fetchedStories.sort((a, b) => a.score - b.score));
    } catch (err) {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const idArray = getRandomIdArray(data, 10);
      fetchStories(idArray);
    }
  }, [data, fetchStories]);

  if (error) return <>Error</>;
  if (isLoading || loading) return <Loader />;

  return (
    <div className="container story-grid">
      {stories.map((item) => (
        <StoryCard data={item} key={item.id} />
      ))}
    </div>
  );
};

export default Stories;
