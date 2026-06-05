import { useMemo } from "react";
import useSWR from "swr";
import StoryCard from "./StoryCard";
import Loader from "../loader";
import { fetcher } from "../../util/fetcher";
import {
  buildStoriesUrl,
  mapAlgoliaHitsToStories,
  type AlgoliaSearchResponse,
} from "../../util/search";
import Error from "../error";
import "./stories.scss";

interface StoriesProps {
  searchQuery?: string;
}

const Stories = ({ searchQuery = "" }: StoriesProps) => {
  const trimmedQuery = searchQuery.trim();

  const { data, error, isLoading } = useSWR<AlgoliaSearchResponse>(
    buildStoriesUrl(trimmedQuery),
    fetcher,
    { revalidateOnFocus: false }
  );

  const stories = useMemo(
    () => (data?.hits ? mapAlgoliaHitsToStories(data.hits) : []),
    [data]
  );

  if (error) return <Error errorMessage={error.message} />;

  if (isLoading) return <Loader />;

  if (trimmedQuery && stories.length === 0) {
    return (
      <div className="container search-empty">
        <p>No stories found for &ldquo;{trimmedQuery}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="container story-grid">
      {stories.map((item) => (
        <StoryCard data={item} key={item.id} />
      ))}
    </div>
  );
};

export default Stories;
