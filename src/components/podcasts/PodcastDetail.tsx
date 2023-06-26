import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Image, Table } from 'react-bootstrap';
import convert from 'xml-js';
import Moment from 'react-moment';
import { useErrorBoundary } from "react-error-boundary";

import { PODCAST } from '../../routes/app/paths';
import { PODCAST_API_DETAIL } from '../../routes/api/paths';
import PodcastCardDetail from './PodcastCardDetail';
import useLoadingContext from '../../hooks/useLoadingContext';
import useLocalStorage from '../../hooks/useLocalStorage';

import { Podcast } from '../../models/Podcast';
import { Episode } from '../../models/Episode';

const PodcastDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const { setLoading } = useLoadingContext();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  
  const getPodcastDetail = (podcastId: string) => {
    fetch(`${PODCAST_API_DETAIL}${podcastId}`)
      .then((res) => res.json())
      .then((data) => {
        fetch(data.results[0].feedUrl)
          .then((res) => res.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(data => {
            const items = data.getElementsByTagName('item');
            const episodesNodes = Array.from(items).slice(0, 10);
            const episodes = stringifyAttr(episodesNodes);
            setEpisodes(episodes);
            const currentDate = new Date().getTime();
            localStorage.setItem(`data${podcastId}`, JSON.stringify({ episodes, lastRequestDate: currentDate }));
            setLoading(false);
          })
          .catch((error) => {
            showBoundary(error);
          });
      })
      .catch((error) => {
        showBoundary(error);
      });
  }

  useEffect(() => {
    if (location.state.podcast) {
      const podcast = location.state.podcast as Podcast;
      setPodcast(podcast);
  
      const data = useLocalStorage(`data${podcast.id.attributes["im:id"]}`);
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

  const stringifyAttr = (elements: Element[]): Episode[] => {
    let newArray: Episode[] = [];
    elements.forEach((e) => {
      const item = JSON.parse(
        convert.xml2json(`
          <?xml version="1.0" encoding="utf-8"?> 
          ${new XMLSerializer().serializeToString(e)}
        `)
      );
      let result: Episode = {};
      item.elements[0].elements.forEach((d) => {
        if (d.elements && d.elements.length > 0 && d.elements[0].type) {
          const element = d.elements[0];
          const type = element.type;
          if (d.name === 'title') result = { ...result, title: element[type] };
          if (d.name === 'pubDate') result = { ...result, date: element[type] };
          if (d.name === 'itunes:duration') result = { ...result, duration: element[type] };
          if (d.name === 'description') result = { ...result, description: element[type] };
          if (d.name === 'guid') result = { ...result, guid: element[type].replaceAll(':', '').replaceAll('/', '') };
        } else if (d.name === 'enclosure') {
          result = {
            ...result,
            audio: d.attributes.url,
            audioType: d.attributes.type,
          };
        }
      });
      newArray = [...newArray, result];
    });
    return newArray;
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
                            episodes.map((e, i) => {
                              return (
                                <tr key={i} onClick={() => handleEpisodeDetail(e)}>
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
