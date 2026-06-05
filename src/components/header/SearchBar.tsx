import { useEffect, useRef, useState, type RefObject } from "react";
import SearchIcon from "../../icons/SearchIcon";

const DEBOUNCE_MS = 500;
const MOBILE_BREAKPOINT = 640;
const EXPANDED_SEARCH_WIDTH = 256;

interface SearchBarProps {
  searchQuery: string;
  brandRef: RefObject<HTMLDivElement | null>;
  onSearch: (query: string) => void;
  onClear: () => void;
  onExpandedChange?: (expanded: boolean, overlay: boolean) => void;
}

const SearchBar = ({
  searchQuery,
  brandRef,
  onSearch,
  onClear,
  onExpandedChange,
}: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!searchQuery) {
      setInputValue("");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!isExpanded && inputValue.trim() === "") return;

    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      setIsOverlay(false);
      return;
    }

    const checkOverlay = () => {
      const isMobile = window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT}px)`,
      ).matches;

      if (isMobile) {
        setIsOverlay(true);
        return;
      }

      const brand = brandRef.current;
      const header = brand?.closest(".header");

      if (!brand || !header) {
        setIsOverlay(false);
        return;
      }

      const brandRect = brand.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const availableSpace = headerRect.right - brandRect.right - 16;

      setIsOverlay(availableSpace < EXPANDED_SEARCH_WIDTH);
    };

    checkOverlay();
    window.addEventListener("resize", checkOverlay);

    return () => window.removeEventListener("resize", checkOverlay);
  }, [isExpanded, brandRef]);

  useEffect(() => {
    onExpandedChange?.(isExpanded, isOverlay);
  }, [isExpanded, isOverlay, onExpandedChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !inputValue.trim()
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleToggle = () => {
    setIsExpanded(true);
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
    setIsExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className={`search-bar ${isExpanded ? "search-bar-expanded" : ""} ${
        isOverlay ? "search-bar-overlay" : ""
      }`}
    >
      <div className="search-bar-form">
        <button
          type="button"
          className="search-bar-toggle"
          onClick={handleToggle}
          aria-label="Open search"
          aria-expanded={isExpanded}
        >
          <SearchIcon />
        </button>
        <input
          ref={inputRef}
          type="search"
          className="search-bar-input"
          placeholder="Search Hacker News..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          aria-label="Search Hacker News stories"
        />
        {(inputValue || searchQuery) && (
          <button
            type="button"
            className="search-bar-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
