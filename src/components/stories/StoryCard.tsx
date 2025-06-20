import type { Story } from "../../types/story";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import LoadingSkeleton from "./LoadingSkeleton";
import ArrowIcon from "../../assets/ArrowIcon";

interface Props {
  data: Story;
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const StoryCard = ({ data }: Props) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    data ? `https://hacker-news.firebaseio.com/v0/user/${data.by}.json` : null,
    fetcher
  );

  if (error) return "Error";
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="story-card">
      <div className="image">
        <img src="/dummy-image.png" alt="story-image"></img>
      </div>
      <div className="details">
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          {data.title}{" "}
        </a>
        <p>
          Posted by <b>{data.by}</b> (
          {new Intl.NumberFormat("dk-DK", {
            maximumSignificantDigits: 3,
          }).format(user?.karma)}{" "}
          points)
        </p>

        <p className="description">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s,
        </p>

        <div className="meta-info">
          <span className="meta">
            <ArrowIcon /> {data.score}
          </span>
          <span>
            •{" "}
            {formatDistanceToNow(new Date(data.time * 1000), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
