import type { Story } from "../types/story";

const ALGOLIA_SEARCH_URL = "https://hn.algolia.com/api/v1/search";
const HITS_PER_PAGE = 20;
const FRONT_PAGE_HITS = 10;

export interface AlgoliaHit {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  num_comments: number;
  created_at_i: number;
  story_id: number;
  children?: number[];
}

export interface AlgoliaSearchResponse {
  hits: AlgoliaHit[];
}

export const buildStoriesUrl = (query = "") => {
  const params = new URLSearchParams({
    tags: query ? "story" : "front_page",
    hitsPerPage: String(query ? HITS_PER_PAGE : FRONT_PAGE_HITS),
  });

  if (query) {
    params.set("query", query);
  }

  return `${ALGOLIA_SEARCH_URL}?${params.toString()}`;
};

export const mapAlgoliaHitToStory = (hit: AlgoliaHit): Story => ({
  id: hit.story_id || Number(hit.objectID),
  title: hit.title,
  by: hit.author,
  score: hit.points,
  descendants: hit.num_comments,
  time: hit.created_at_i,
  url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
  kids: hit.children || [],
  type: "story",
});

export const mapAlgoliaHitsToStories = (hits: AlgoliaHit[]): Story[] =>
  hits.map(mapAlgoliaHitToStory).sort((a, b) => b.score - a.score);
