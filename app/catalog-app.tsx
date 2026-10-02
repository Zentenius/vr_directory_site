"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Dices,
  ExternalLink,
  Gamepad2,
  Heart,
  Info,
  Paintbrush,
  Puzzle,
  Search,
  Sparkles,
  Star,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Game = {
  title: string;
  author: string;
  description?: string;
  url: string;
  image_url: string;
  tags: string[];
  framework: string;
  source: string;
  platforms?: string[];
  price?: string;
  genre?: string;
  game_id?: string;
};

type Category = {
  icon: LucideIcon;
  label: string;
  terms: string[];
};

const categories: Category[] = [
  { icon: Zap, label: "Quick play", terms: ["game", "arcade", "sports", "casual"] },
  { icon: Crosshair, label: "Action", terms: ["action", "shooter", "survival", "fighting"] },
  { icon: Puzzle, label: "Puzzle", terms: ["puzzle", "escape", "maze", "strategy"] },
  { icon: Compass, label: "Explore", terms: ["adventure", "exploration", "tour", "space"] },
  { icon: Paintbrush, label: "Create", terms: ["art", "music", "creative", "drawing"] },
  { icon: UsersRound, label: "Social", terms: ["social", "multiplayer", "interactive"] },
];

const featuredTitles = ["Moon Rider", "Barista Express", "A-Painter", "VRBlocks"];

function haystack(game: Game) {
  return [game.title, game.author, game.description, game.genre, ...game.tags]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function gameKey(game: Game) {
  return game.game_id ? `${game.source}:${game.game_id}` : game.url;
}

function GameImage({ game, eager = false }: { game: Game; eager?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (!game.image_url || failed) {
    return <span className="art-fallback" aria-hidden="true"><Gamepad2 /></span>;
  }

  return <img src={game.image_url} alt="" loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />;
}

export default function CatalogApp({ games, total }: { games: Game[]; total: number }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Game | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("club-xr-favorites") ?? "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const featuredGames = useMemo(
    () => featuredTitles.map((title) => games.find((game) => game.title === title)).filter((game): game is Game => Boolean(game)),
    [games],
  );

  useEffect(() => {
    if (featuredPaused || featuredGames.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setFeaturedIndex((index) => (index + 1) % featuredGames.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [featuredGames.length, featuredPaused]);

  function moveFeatured(direction: number) {
    setFeaturedPaused(true);
    setFeaturedIndex((index) => (index + direction + featuredGames.length) % featuredGames.length);
  }

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeCategory = categories.find((item) => item.label === category);

    return games.filter((game) => {
      const text = haystack(game);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory = !activeCategory || activeCategory.terms.some((term) => text.includes(term));
      const matchesFavorite = !favoritesOnly || favorites.includes(gameKey(game));
      return matchesQuery && matchesCategory && matchesFavorite;
    });
  }, [category, favorites, favoritesOnly, games, query]);

  useEffect(() => setVisibleCount(24), [query, category, favoritesOnly]);

  function toggleFavorite(game: Game) {
    const key = gameKey(game);
    setFavorites((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      localStorage.setItem("club-xr-favorites", JSON.stringify(next));
      return next;
    });
  }

  function pickCategory(label: string | null) {
    setCategory((current) => (current === label ? null : label));
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function surpriseMe() {
    const pool = results.length ? results : games;
    setSelected(pool[Math.floor(Math.random() * pool.length)]);
  }

  function browseAll() {
    setQuery("");
    setCategory(null);
    setFavoritesOnly(false);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Club XR home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span><strong>CLUB XR</strong><small>SOFTWARE ENGINEERING CLUB</small></span>
        </a>
        <div className="header-tools">
          <div className="header-count"><b>{total}</b> browser-ready worlds</div>
          <button
            type="button"
            className={`favorites-filter ${favoritesOnly ? "active" : ""}`}
            onClick={() => setFavoritesOnly((value) => !value)}
            aria-pressed={favoritesOnly}
          >
            <Heart size={18} fill={favoritesOnly ? "currentColor" : "none"} />
            <span>{favorites.length}</span>
          </button>
        </div>
      </header>

      <section id="top" className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Club Expo VR Arcade</p>
          <h1 className="club-hero-name">
            <span>Software</span>
            <span>Engineering</span>
            <span>Club</span>
          </h1>
          <p className="hero-callout">Your next world is one click away.</p>
          <p className="hero-sub">Made for the headset. No installs, no endless scrolling—just choose a vibe and play.</p>

          <label className="search-box">
            <Search size={24} />
            <input
              aria-label="Search games"
              placeholder="Search games, genres, creators…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button> : <kbd>⌕</kbd>}
          </label>

          <div className="quick-actions" aria-label="Quick actions">
            <button type="button" className="primary-action" onClick={surpriseMe}><Dices size={22} /> Surprise me</button>
            <button type="button" className="secondary-action" onClick={browseAll}>Browse all {total}</button>
          </div>
        </div>

        <div
          className="featured-carousel"
          onMouseEnter={() => setFeaturedPaused(true)}
          onMouseLeave={() => setFeaturedPaused(false)}
          onFocusCapture={() => setFeaturedPaused(true)}
          onBlurCapture={() => setFeaturedPaused(false)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") moveFeatured(-1);
            if (event.key === "ArrowRight") moveFeatured(1);
          }}
          aria-label="Featured VR worlds"
          aria-roledescription="carousel"
        >
          <div className="featured-viewport">
            <div className="featured-track" style={{ transform: `translateX(-${featuredIndex * 100}%)` }}>
            {featuredGames.map((featured, index) => (
              <div className="featured-slide" key={gameKey(featured)} aria-hidden={index !== featuredIndex}>
                <button type="button" tabIndex={index === featuredIndex ? 0 : -1} className="featured-card" onClick={() => setSelected(featured)} aria-label={`See details for ${featured.title}`}>
                  <GameImage game={featured} eager={index === 0} />
                  <span className="featured-shade" />
                  <span className="featured-badge">Featured world</span>
                  <span className="featured-copy">
                    <span className="play-orb" aria-hidden="true">▶</span>
                    <span>
                      <small>{featured.tags.slice(0, 2).join(" · ")}</small>
                      <strong>{featured.title}</strong>
                      <em>by {featured.author}</em>
                    </span>
                    <span className="featured-arrow"><ArrowUpRight /></span>
                  </span>
                </button>
              </div>
            ))}
            </div>
          </div>
          <button type="button" className="featured-nav featured-prev" aria-label="Previous featured world" onClick={() => moveFeatured(-1)}><ChevronLeft /></button>
          <button type="button" className="featured-nav featured-next" aria-label="Next featured world" onClick={() => moveFeatured(1)}><ChevronRight /></button>
          <div className="featured-dots" aria-label={`Featured world ${featuredIndex + 1} of ${featuredGames.length}`}>
            {featuredGames.map((game, index) => (
              <button
                type="button"
                className={index === featuredIndex ? "active" : ""}
                key={gameKey(game)}
                onClick={() => {
                  setFeaturedPaused(true);
                  setFeaturedIndex(index);
                }}
                aria-label={`Show ${game.title}`}
                aria-current={index === featuredIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="discovery-section">
        <div className="section-heading">
          <div><span>01</span><h2>Choose your vibe</h2></div>
          <p>Big targets, less typing. Start with what sounds fun.</p>
        </div>
        <div className="category-rail">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
            <button
              type="button"
              className={`category-pill ${category === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => pickCategory(item.label)}
              aria-pressed={category === item.label}
            >
              <span className="category-icon" aria-hidden="true"><Icon /></span>{item.label}
            </button>
            );
          })}
        </div>
      </section>

      <section className="shelf-section" ref={resultsRef}>
        <div className="section-heading compact">
          <div><span>02</span><h2>{favoritesOnly ? "Saved worlds" : category ?? (query ? "Search results" : "Jump in fast")}</h2></div>
          <p className="result-count">{results.length} {results.length === 1 ? "world" : "worlds"}</p>
        </div>

        {(query || category || favoritesOnly) && (
          <div className="active-filters" aria-label="Active filters">
            {query && <button type="button" onClick={() => setQuery("")}>Search: “{query}” <span>×</span></button>}
            {category && <button type="button" onClick={() => setCategory(null)}>{category} <span>×</span></button>}
            {favoritesOnly && <button type="button" onClick={() => setFavoritesOnly(false)}>Favorites <span>×</span></button>}
            <button type="button" className="clear-all" onClick={browseAll}>Clear all</button>
          </div>
        )}

        {results.length ? (
          <>
            <div className="game-shelf">
              {results.slice(0, visibleCount).map((game, index) => {
                const favorite = favorites.includes(gameKey(game));
                return (
                  <article className="game-card" key={gameKey(game)}>
                    <button type="button" className="game-open" onClick={() => setSelected(game)} aria-label={`See details for ${game.title}`}>
                      <span className="game-art">
                        <GameImage game={game} eager={index <= 7} />
                        <span>{game.genre ?? game.tags[0] ?? "Experience"}</span>
                        <i><Info size={17} /> Details</i>
                      </span>
                      <span className="game-info"><strong>{game.title}</strong><small>{game.author}</small></span>
                    </button>
                    <button
                      type="button"
                      className={`favorite-button ${favorite ? "active" : ""}`}
                      onClick={() => toggleFavorite(game)}
                      aria-label={`${favorite ? "Remove" : "Add"} ${game.title} ${favorite ? "from" : "to"} favorites`}
                    >
                      <Heart size={18} fill={favorite ? "currentColor" : "none"} />
                    </button>
                  </article>
                );
              })}
            </div>
            {visibleCount < results.length && (
              <button type="button" className="load-more" onClick={() => setVisibleCount((count) => count + 24)}>
                Show 24 more <span>{results.length - visibleCount} left</span>
              </button>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Gamepad2 size={42} />
            <h3>No worlds found</h3>
            <p>Try a broader search or clear your filters.</p>
            <button type="button" onClick={browseAll}>Reset catalog</button>
          </div>
        )}
      </section>

      <footer className="site-footer">
        <div className="brand compact-brand"><span className="brand-mark" aria-hidden="true"><span /></span><span><strong>CLUB XR</strong><small>BUILT FOR THE EXPO</small></span></div>
        <p>Curated by the Software Engineering Club · WebXR experiences open on their creators&apos; sites.</p>
      </footer>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="game-sheet sm:max-w-[640px]" side="right">
          {selected && (
            <>
              <div className="sheet-art"><GameImage game={selected} eager /></div>
              <SheetHeader className="sheet-header">
                <div className="sheet-kicker"><span>{selected.framework}</span><span>{selected.source}</span></div>
                <SheetTitle className="sheet-title">{selected.title}</SheetTitle>
                <SheetDescription className="sheet-author">by {selected.author}</SheetDescription>
              </SheetHeader>
              <div className="sheet-body">
                <p>{selected.description?.trim() || "A browser-based VR experience ready to explore."}</p>
                <div className="tag-list">
                  {Array.from(new Set([selected.genre, ...selected.tags].filter(Boolean) as string[])).slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="launch-note"><Star size={19} /><span><b>Headset tip</b> Open in the Meta Quest Browser, then look for the headset or “Enter VR” button on the game page.</span></div>
              </div>
              <div className="sheet-actions">
                <button type="button" className={`save-large ${favorites.includes(gameKey(selected)) ? "active" : ""}`} onClick={() => toggleFavorite(selected)}>
                  <Heart size={20} fill={favorites.includes(gameKey(selected)) ? "currentColor" : "none"} />
                  {favorites.includes(gameKey(selected)) ? "Saved" : "Save"}
                </button>
                <a href={selected.url} target="_blank" rel="noreferrer" className="launch-button">Launch experience <ExternalLink size={20} /></a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
