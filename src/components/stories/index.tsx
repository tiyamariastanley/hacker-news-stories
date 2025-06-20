import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Story } from "../../types/story";
import StoryCard from "./StoryCard";
import "./stories.scss";
import Loader from "./Loader";

const Stories = () => {
  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState<boolean>(false);
  const [errorStories, setErrorStories] = useState<boolean>(false);

  const { data, error, isLoading } = useSWR(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (!data) return;
    setIsLoadingStories(true);
    const idArray = getRandomIdArray(data, 10);
    fetchStories(idArray);
  }, [data]);

  const getRandomIdArray = (data: number[], count: number) => {
    const result = new Set<number>();

    while (result.size < count) {
      const index = Math.floor(Math.random() * data.length);
      result.add(data[index]);
    }

    return Array.from(result);
  };

  const fetchStories = async (idArray: number[]) => {
    try {
      const storyPromises = idArray.map((id) =>
        fetcher(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );

      const fetchedStories = await Promise.all(storyPromises);
      fetchedStories.sort((a, b) => a.score - b.score);
      setStories(fetchedStories);
      setIsLoadingStories(false);
    } catch (err) {
      console.error("Failed to fetch random stories:", err);
      setErrorStories(true);
    }
  };

  if (error || errorStories) return "Error";

  if (isLoading || isLoadingStories) return <Loader />;

  return (
    <div className="container story-grid">
      {stories.map((item) => (
        <StoryCard data={item} key={item.id} />
      ))}
    </div>
  );
};

export default Stories;
