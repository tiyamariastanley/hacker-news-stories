import type { Story } from "../../types/story";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import ArrowIcon from "../../icons/ArrowIcon";
import ClockIcon from "../../icons/ClockIcon";
import { fetcher } from "../../util/fetcher";
import UserIcon from "../../icons/UserIcon";

interface Props {
  data: Story;
}

const StoryCard = ({ data }: Props) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    data ? `https://hacker-news.firebaseio.com/v0/user/${data.by}.json` : null,
    fetcher
  );

  return (
    <div className="story-card" data-testid="story-card">
      <div className="image">
        <img src="/image.png" alt="story-image" />
      </div>
      <div className="details">
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          {data.title}
        </a>
        <div className="icon-info">
          <UserIcon /> <b>{data.by}</b>
          {isLoading ? (
            <span
              className="date-bar skeleton-bar"
              data-testid="karma-loader"
            ></span>
          ) : error ? (
            <span style={{ color: "#999" }}>(Failed to load karma)</span>
          ) : (
            <span>({user.karma.toLocaleString()} karma)</span>
          )}
        </div>
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
          <span className="icon-info">
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
