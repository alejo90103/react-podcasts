import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Container, Card, Row, Col } from 'react-bootstrap';

import PodcastCard from './PodcastCard';

const EpisodeDetail = () => {
  const location = useLocation();
  const [podcast, setPodcast] = useState(null);
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    if (location.state.podcast && location.state.episode) {
      setPodcast(location.state.podcast);
      setEpisode(location.state.episode);
    }
  }, []);

  return (
    <Container>
      {
        podcast &&
          <Row className="mt-4">
            <Col sm={12} md={4}>
              <PodcastCard podcast={podcast} navigateBack={true}/>
            </Col>
            {
              episode ?
                <Col sm={12} md={8}>
                  <Card
                    className="mb-2 shadow bg-white rounded border-0 p-3"
                  >
                    <Card.Header className="bg-white border-0">
                      <h4 className="m-0">{episode.title}</h4>
                      <Card.Text className="text-muted mt-2" style={{ fontStyle: "italic" }}>
                        <div dangerouslySetInnerHTML={{ __html: `${episode.description}` }} />
                      </Card.Text>
                      <hr className="text-muted" />
                      <audio controls className="w-100">
                        <source src={episode.audio} type={episode.audioType}/>
                        Your browser does not support the audio element.
                      </audio>
                    </Card.Header>
                  </Card>
                </Col>
              :
                <Col sm={12} md={8}>
                  <Card.Header className="p-3 shadow bg-white rounded border-0">
                    <h4 className="m-0">No Episodes</h4>
                  </Card.Header>
                </Col>
            }
          </Row>
      }
    </Container>
  );
}

export default EpisodeDetail;
