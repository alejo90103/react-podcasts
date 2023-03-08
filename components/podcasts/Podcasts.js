import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Image, Form } from 'react-bootstrap';

import { PODCAST } from '../../routes/app/paths';

const Podcasts = () => {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState(null);
  const [originalPodcasts, setOriginalPodcasts] = useState(null);
  const [count, setCount] = useState(0);

  const getPodcasts = () => {
    fetch("https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json")
      .then((res) => res.json())
      .then((data) => {
        const podcasts = data.feed.entry;
        setPodcasts(podcasts);
        setOriginalPodcasts(podcasts);
        setCount(podcasts.length)
        const currentDate = new Date().getTime();
        localStorage.setItem('listData', JSON.stringify({ podcasts, lastRequestDate: currentDate }));
      });
  }

  useEffect(() => {
    const listData = JSON.parse(localStorage.getItem('listData'));
    if (listData && (new Date().getTime() - listData.lastRequestDate) < (24 * 60 * 60 * 1000)) {
      // Use the list stored in the local storage
      setPodcasts(listData.podcasts);
      setOriginalPodcasts(listData.podcasts);
      setCount(listData.podcasts.length)
    } else {
      // Fetch the list from the external service again
      getPodcasts();
    }
    
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = originalPodcasts.filter(e => {
      if (e["im:name"].label.toLowerCase().includes(search) || e["im:artist"].label.toLowerCase().includes(search)) {
        return e;
      }
    });
    setPodcasts(filtered);
  } 

  const hadleDetail = (e) => {
    navigate(`${PODCAST}/${e.id.attributes["im:id"]}`, {
      state: { podcast: e }
    });
  }

  return (
    <Container>
      <Row className="mt-2">
        <Col className='p-3 my-4 d-flex justify-content-end'>
          <span className="badge badge-pill bg-info text-white align-self-center mx-2" style={{ height: "fit-content" }}>{count}</span>
          <Form.Control
            type="text"
            className="form-control"
            style={{ width: "20%" }}
            id="search"
            placeholder="Filter podcasts..."
            onChange={(e) => handleSearch(e)}
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
                  style={{ minWidth: "18rem", cursor: "pointer" }}
                  className="mb-2 shadow bg-white rounded text-center border-0"
                  onClick={() => hadleDetail(e)}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -60
                  }}>
                    <Image style={{maxHeight: 130}} roundedCircle src={e["im:image"].length > 0 ? e["im:image"][e["im:image"].length - 1].label : "" } />
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
