import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { format, intervalToDuration } from "date-fns";
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import convert from 'xml-js';
import Moment from 'react-moment';
import { useErrorBoundary } from "react-error-boundary";

import { PODCAST } from '../../routes/app/paths';
import { PODCAST_API_DETAIL, CORS } from '../../routes/api/paths';
import PodcastCardDetail from './PodcastCardDetail';
import useLoadingContext from '../../hooks/useLoadingContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { formatTimeMillis } from '../../utils/utils';

import { Podcast } from '../../models/Podcast';
import { Episode } from '../../models/Episode';

const PodcastDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const { setLoading } = useLoadingContext();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const data = useLocalStorage(`data${location.state.podcast.id.attributes["im:id"]}`);
  
  const getPodcastDetail = (podcastId: string) => {
    const url = `${PODCAST_API_DETAIL}${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;
    fetch(`${CORS}${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        const episodes: Episode[] = data.results
          .filter((e) => e.wrapperType === "podcastEpisode")
          .map((e) => {
            return {
              title: e.trackName,
              date: e.releaseDate,
              duration: formatTimeMillis(e.trackTimeMillis),
              description: e.description,
              guid: e.episodeGuid,
              audio: e.episodeUrl,
              audioType: `${e.episodeContentType}/${e.episodeFileExtension}`,
            }
          });
        setEpisodes(episodes);
        localStorage.setItem(`data${podcastId}`, JSON.stringify({ episodes, lastRequestDate: new Date().getTime() }));
        setLoading(false);
      })
      .catch((error) => { showBoundary(error); });
  }

  useEffect(() => {
    if (location.state.podcast) {
      const podcast = location.state.podcast as Podcast;
      setPodcast(podcast);
  
      // if has storage data
      if (data) {
        // Use the list stored in the local storage
        setEpisodes(data.episodes);
        setLoading(false);
      } else {
        // Fetch the list from the external service again
        // getPodcastDetail(podcast.id.attributes["im:id"]);
        setTimeout(() => {
          getPodcastDetail(podcast.id.attributes["im:id"]);
        }, 1000);
      }
    }
  }, []);

  const handleEpisodeDetail = (episode: Episode) => {
    setLoading(true);
    navigate(`${PODCAST}/${podcast?.id.attributes['im:id']}/episode/${episode.guid}`, {
      state: {
        podcast,
        episode,
      },
    });
  };

  return (
    <Container>
      {
        podcast &&
          <Row className="mt-4">
            <Col sm={12} md={4}>
              <PodcastCardDetail podcast={podcast} />
            </Col>
            {
              episodes ?
                <Col sm={12} md={8}>
                    <Card.Header className="p-3 shadow bg-white rounded border-0">
                      <h4 className="m-0">Episodes: {episodes.length}</h4>
                    </Card.Header>
                    <Card
                      style={{ minWidth: "18rem" }}
                      className="mb-2 shadow bg-white rounded border-0 p-4 mt-4 cursor-pointer"
                    >
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th style={{ width: '60%' }}>Title</th>
                            <th style={{ width: '20%' }}>Date</th>
                            <th style={{ width: '20%' }}>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            episodes.map((e) => {
                              return (
                                <tr key={e.guid} onClick={() => handleEpisodeDetail(e)}>
                                  <td className="text-info">{e.title}</td>
                                  <td><Moment date={e.date} format="DD/MM/YYYY" /></td>
                                  <td>{e.duration}</td>
                                </tr>
                              )
                            }) 
                          }
                        </tbody>
                      </Table>
                    </Card>
                </Col>
              :
                <Col sm={12} md={8}>
                  <Card.Header className="p-3 shadow bg-white rounded border-0">
                    <h4 className="m-0">No Podcasts</h4>
                  </Card.Header>
                </Col>
            }
          </Row>
      }
    </Container>
  );
}

export default PodcastDetail;
