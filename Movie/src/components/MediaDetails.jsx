/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import { apiRequest } from "../services/client";

export default function MediaDetails() {
  const { selectedMedia, closeDetails } = useMovieContext();
  const [details, setDetails] = useState(null);
  const [summary, setSummary] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    if (!selectedMedia) return;
    let active = true;
    setDetails(null);
    setSummary(null);
    setDetailError("");
    setSummaryError("");
    const { mediaType, id } = selectedMedia;

    apiRequest(`/api/movies/${mediaType}/${id}`)
      .then((data) => active && setDetails(data))
      .catch((error) => active && setDetailError(error.message));
    apiRequest(`/api/movies/${mediaType}/${id}/summary`)
      .then((data) => active && setSummary(data))
      .catch((error) => active && setSummaryError(error.message));

    return () => { active = false; };
  }, [selectedMedia]);

  if (!selectedMedia) return null;
  const title = details?.title || details?.name;
  const release = details?.release_date || details?.first_air_date;
  const cast = details?.credits?.cast?.slice(0, 5).map((person) => person.name).join(", ");

  return (
    <div className="detailsBackdrop" onMouseDown={closeDetails} role="presentation">
      <section className="detailsPanel" onMouseDown={(event) => event.stopPropagation()} aria-label="Title details">
        <button className="closeButton" onClick={closeDetails} aria-label="Close details">×</button>
        {!details && !detailError && <div className="panelLoading">Loading title details…</div>}
        {detailError && <p className="errorMessage">{detailError}</p>}
        {details && (
          <>
            <div className="detailsHero" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${details.backdrop_path})` }}>
              <div className="detailsHeroShade" />
              <div className="detailsHeading">
                <span className="eyebrow">{selectedMedia.mediaType === "movie" ? "Movie" : "Series"}</span>
                <h2>{title}</h2>
                <p>{release?.slice(0, 4)} · ⭐ {details.vote_average?.toFixed(1)} · {details.runtime ? `${details.runtime} min` : `${details.number_of_seasons || 1} season(s)`}</p>
              </div>
            </div>
            <div className="detailsContent">
              <div>
                <h3>About</h3>
                <p>{details.overview || "No overview is available."}</p>
                <dl className="metadata">
                  <div><dt>Genres</dt><dd>{details.genres?.map((genre) => genre.name).join(", ") || "—"}</dd></div>
                  <div><dt>Cast</dt><dd>{cast || "—"}</dd></div>
                  <div><dt>Status</dt><dd>{details.status || "—"}</dd></div>
                </dl>
              </div>
              <aside className="aiSummary">
                <span className="aiLabel">✦ AI quick take</span>
                {!summary && !summaryError && <p>Creating a simple, spoiler-free summary…</p>}
                {summaryError && <p className="errorMessage">{summaryError}</p>}
                {summary && <>
                  <p>{summary.summary}</p>
                  <small>{summary.cached ? "Loaded from summary cache" : "New summary saved for future viewers"}</small>
                </>}
              </aside>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
