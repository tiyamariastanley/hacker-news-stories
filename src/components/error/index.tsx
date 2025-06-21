import "./Error.scss";

const Error = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="error-container">
      <p>{errorMessage}</p>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );
};

export default Error;
