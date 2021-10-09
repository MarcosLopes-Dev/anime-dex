import Player from 'react-player/lazy';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './styles.scss';

function Details() {
  const { id } = useParams();
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadData() {
      const resAnime = await api.get(`/anime/${id}`);
      console.log('Anime: ', resAnime.data);
      setAnime(resAnime.data);

      const resRecommendations = await api.get(`/anime/${id}/recommendations`);
      console.log('Recommendations: ', resRecommendations.data.recommendations);
      setRecommendations(resRecommendations.data.recommendations);

      setIsLoading(false);
    }
    loadData();
    return () => setIsLoading(true);
  }, [id]);

  return (
    <section className="section">
      {isLoading ? (
        <div className="container has-text-centered">
          <h1 className="title is-2">Loading...</h1>
          <span className="button is-text is-loading is-large" />
        </div>
      ) : (
        <article className="details box">
          <header className="details-header">
            <img
              src={anime.image_url}
              alt={anime.title}
              className="details-photo"
            />
            <div className="details-info">
              <hgroup className="details-info-titles">
                <h1 className="title is-1">{anime.title}</h1>
                <h2 className="subtitle is-4">{`${anime.title_english} / ${anime.title_japanese}`}</h2>
              </hgroup>
              <div className="details-info-data">
                <p>
                  Total Eps: <i>{anime.episodes}</i>
                </p>
                <p>
                  Status: &nbsp;
                  <span className="tag is-warning is-light is-normal">
                    {anime.status}
                  </span>
                </p>
                <div className="data-tags">
                  <p>Genres:</p>
                  <ul className="tags">
                    {anime.genres.map((genre) => (
                      <li key={genre.mal_id} className="tag is-info is-light">
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </header> 
        <section className="section">
          <h3 className="subtitle is-4">Synopse</h3>
          <p className="has-text-justified">{anime.synopsis}</p>
        </section>
        <section className="details-trailer">
          <Player url={anime.trailer_url} controls />
        </section>
      </article>
    )}
  </section>
  );
}

export default Details;