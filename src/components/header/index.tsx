import "./header.scss";

const Header = () => {
  return (
    <header>
      <div className="container header">
        <img src="/news-icon.svg" alt="News Icon" />
        <h1>Hacker News Bulletin</h1>
      </div>
    </header>
  );
};

export default Header;
