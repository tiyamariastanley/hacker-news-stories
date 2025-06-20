import "./Loading.scss";

const LoadingSkeleton = () => {
  return (
    <div className="loading-card">
      <div className="image" />
      <div className="loading-details">
        <div className="title-bar skeleton-bar" />
        <div className="date-bar skeleton-bar" />
        <div className="meta-bar skeleton-bar" />
        <div className="desc-bar skeleton-bar" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
