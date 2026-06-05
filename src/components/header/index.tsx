import { useRef, useState } from "react";
import "./header.scss";
import SearchBar from "./SearchBar";

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

const Header = ({ searchQuery, onSearch, onClearSearch }: HeaderProps) => {
  const brandRef = useRef<HTMLDivElement>(null);
  const [searchOverlay, setSearchOverlay] = useState(false);

  return (
    <header>
      <div
        className={`container header ${
          searchOverlay ? "header-search-overlay" : ""
        }`}
      >
        <div className="header-brand" ref={brandRef}>
          <img src="/news-icon.svg" alt="News Icon" />
          <h1>Hacker News Bulletin</h1>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          brandRef={brandRef}
          onSearch={onSearch}
          onClear={onClearSearch}
          onExpandedChange={(_, overlay) => setSearchOverlay(overlay)}
        />
      </div>
    </header>
  );
};

export default Header;
