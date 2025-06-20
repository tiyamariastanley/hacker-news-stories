import type { Story } from "../../types/story";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import ArrowIcon from "../../icons/ArrowIcon";
import ClockIcon from "../../icons/ClockIcon";
import LoadingSkeleton from "../loader/LoadingSkeleton";

interface Props {
  data: Story;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StoryCard = ({ data }: Props) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    data ? `https://hacker-news.firebaseio.com/v0/user/${data.by}.json` : null,
    fetcher
  );

  if (error) return <div>Error</div>;
  if (isLoading || !user) return <LoadingSkeleton />;

  return (
    <div className="story-card">
      <div className="image">
        <img src="/dummy-image.webp" alt="story" />
      </div>
      <div className="details">
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          {data.title}
        </a>
        <p>
          Posted by <b>{data.by}</b> (
          {user.karma !== undefined
            ? new Intl.NumberFormat("da-DK", {
                maximumSignificantDigits: 3,
              }).format(user.karma)
            : "N/A"}{" "}
          points)
        </p>
        <p className="description">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <div className="meta-info">
          <span className="meta">
            <ArrowIcon /> {data.score}
          </span>
          <span className="time">
            <ClockIcon />{" "}
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
