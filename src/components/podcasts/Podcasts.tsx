import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Image, Form, Badge } from 'react-bootstrap';
import { useErrorBoundary } from "react-error-boundary";

import { PODCAST } from '../../routes/app/paths';
import { PODCAST_API_ALL } from '../../routes/api/paths';
import useLoadingContext from '../../hooks/useLoadingContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Podcast } from '../../models/Podcast';

const Podcasts: React.FC = () => {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const { setLoading } = useLoadingContext();
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null);
  const [originalPodcasts, setOriginalPodcasts] = useState<Podcast[] | null>(null);

  const getPodcasts = () => {
    fetch(PODCAST_API_ALL)
      .then((res) => res.json())
      .then((data) => {
        const podcasts = data.feed.entry;
        setPodcasts(podcasts);
        setOriginalPodcasts(podcasts);
        const currentDate = new Date().getTime();
        localStorage.setItem('listData', JSON.stringify({ podcasts, lastRequestDate: currentDate }));
        setLoading(false);
      })
      .catch((error) => {
        showBoundary(error);
      });
  }

  useEffect(() => {
    const data = useLocalStorage('listData');
    if (data) {
      // Use the list stored in the local storage
      setPodcasts(data.podcasts);
      setOriginalPodcasts(data.podcasts);
      setLoading(false);
    } else {
      // Fetch the list from the external service again
      getPodcasts();
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    const filtered = originalPodcasts.filter(e => {
      if (e["im:name"].label.toLowerCase().includes(search) || e["im:artist"].label.toLowerCase().includes(search)) {
        return e;
      }
    });
    setPodcasts(filtered);
  } 

  const hadleDetail = (podcast: Podcast) => {
    setLoading(true);
    navigate(`${PODCAST}/${podcast.id.attributes["im:id"]}`, {
      state: { podcast: podcast }
    });
  }

  return (
    <Container>
      <Row className="mt-2">
        <Col className='p-3 my-4 d-flex justify-content-end'>
          <h3 className="m-0"><Badge bg="info" className="mx-2">{podcasts && podcasts.length}</Badge></h3>
          <Form.Control
            type="text"
            className="form-control"
            style={{ width: "20%" }}
            id="search"
            placeholder="Filter podcasts..."
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-4">
        {
          podcasts &&
          podcasts.map((e, i) => {
            return (
              <Col key={i} className='p-3 my-4'>
                <Card
                  style={{ minWidth: "18rem" }}
                  className="mb-2 shadow bg-white rounded text-center border-0 cursor-pointer"
                  onClick={() => hadleDetail(e)}
                >
                  <div className="image-postcast">
                    <Image roundedCircle src={e["im:image"].length > 0 ? e["im:image"][e["im:image"].length - 1].label : "" } />
                  </div>
                  <Card.Body style={{ marginTop: 60 }}>
                    <Card.Title>{e["im:name"].label}</Card.Title>
                    <Card.Text className="text-muted">Author: {e["im:artist"].label}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        }
      </Row>
    </Container>
  );
}

export default Podcasts;
