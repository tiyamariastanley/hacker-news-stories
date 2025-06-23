import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import type { Story } from "../../types/story";
import StoryCard from "./StoryCard";
import Loader from "../loader";
import { fetcher } from "../../util/fetcher";
import { getRandomIdArray } from "../../util";
import Error from "../error";
import "./stories.scss";

const Stories = () => {
  const { data, error, isLoading } = useSWR<number[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    fetcher,
    { revalidateOnFocus: false }
  );

  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [errorStories, setErrorStories] = useState<unknown>(null);

  const fetchStories = useCallback(async (ids: number[]) => {
    setLoadingStories(true);
    try {
      const storyPromises = ids.map((id) =>
        fetcher(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const fetchedStories: Story[] = await Promise.all(storyPromises);
      setStories(fetchedStories.sort((a, b) => a.score - b.score));
    } catch (err) {
      setErrorStories(err);
    } finally {
      setLoadingStories(false);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const idArray = getRandomIdArray(data, 10);

      fetchStories(idArray);
    }
  }, [data, fetchStories]);

  if (error || errorStories) return <Error errorMessage={error.message} />;

  if (isLoading || loadingStories) return <Loader />;

  return (
    <div className="container story-grid">
      {stories.map((item) => (
        <StoryCard data={item} key={item.id} />
      ))}
    </div>
  );
};

export default Stories;
