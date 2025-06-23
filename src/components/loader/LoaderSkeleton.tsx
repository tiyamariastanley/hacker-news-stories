import "./Loader.scss";

const LoaderSkeleton = () => {
  return (
    <div className="loading-card" data-testid="loader-skeleton">
      <div className="image" />
      <div className="loading-details">
        <div className="title-bar skeleton-bar" />
        <div className="meta-bar skeleton-bar" />
        <div className="desc-bar skeleton-bar" />
        <div className="date-bar-container">
          <span className="date-bar skeleton-bar"></span>
          <span className="date-bar skeleton-bar"></span>
        </div>
      </div>
    </div>
  );
};

export default LoaderSkeleton;
