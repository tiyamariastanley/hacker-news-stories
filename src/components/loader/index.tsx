import LoadingSkeleton from "./LoaderSkeleton";
import "./Loader.scss";

const Loader = () => {
  return (
    <div className="container">
      <div className="loading-grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
