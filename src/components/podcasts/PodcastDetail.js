import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Image, Table } from 'react-bootstrap';
import convert from 'xml-js';
import Moment from 'react-moment';

import { PODCAST } from '../../routes/app/paths';
import { PODCAST_API_DETAIL } from '../../routes/api/paths';
import PodcastCard from './PodcastCard';

const PodcastDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  
  const getPodcastDetail = (podcastId) => {
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
          });
      });
  }

  useEffect(() => {
    if (location.state.podcast) {
      const podcast = location.state.podcast;
      setPodcast(podcast);
  
      const data = JSON.parse(localStorage.getItem(`data${podcast.id.attributes["im:id"]}`));
      if (data && (new Date().getTime() - data.lastRequestDate) < (24 * 60 * 60 * 1000)) {
        // Use the list stored in the local storage
        setEpisodes(data.episodes);
      } else {
        // Fetch the list from the external service again
        getPodcastDetail(podcast.id.attributes["im:id"]);
      }
    }
  }, []);

  const handleEpisodeDetail = (episode) => {
    navigate(`${PODCAST}/${podcast.id.attributes["im:id"]}/episode/${episode.guid}`, {
      state: { 
        podcast,
        episode 
      }
    });
  }

  const stringifyAttr = (elements) => {
    let newArray = [];
    elements.map((e) => {
      const item = JSON.parse(convert.xml2json(`
        <?xml version="1.0" encoding="utf-8"?> 
        ${new XMLSerializer().serializeToString(e)}
      `));
      let result = {};
      item.elements[0].elements.map((d) => {
        if (d.elements && d.elements.length > 0 && d.elements[0].type) {
          const element = d.elements[0];
          const type = element.type;
          (d.name === "title") && (result = { ...result, "title": element[type] });
          (d.name === "pubDate") && (result = { ...result, "date": element[type] });
          (d.name === "itunes:duration") && (result = { ...result, "duration": element[type] });
          (d.name === "description") && (result = { ...result, "description": element[type] });
          (d.name === "guid") && (result = { ...result, "guid": element[type].replaceAll(":", '').replaceAll("/", '') });
        } else if (d.name === "enclosure") {
          result = {
            ...result, 
            "audio": d.attributes.url, 
            "audioType": d.attributes.type 
          }
        }
      }) 
      newArray = [...newArray, result];
    });
    return newArray;
  }

  return (
    <Container>
      {
        podcast &&
          <Row className="mt-4">
            <Col sm={12} md={4}>
              <PodcastCard podcast={podcast} />
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
