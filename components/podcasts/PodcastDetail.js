import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Container, Card, Row, Col, Image, Table } from 'react-bootstrap';
import convert from 'xml-js';
import { format } from 'date-fns';
import Moment from 'react-moment';

const PodcastDetail = () => {
  const location = useLocation();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  
  const getPodcastDetail = (podcastId) => {
    fetch(`https://itunes.apple.com/lookup?id=${podcastId}`)
      .then((res) => res.json())
      .then((data) => {
        fetch(data.results[0].feedUrl)
          .then((res) => res.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(data => {
            const items = data.getElementsByTagName('item');
            setEpisodes((Array.from(items).slice(0, 10)));
          });
      });
  }

  useEffect(() => {
    const podcast = location.state.podcast;
    setPodcast(podcast);
    getPodcastDetail(podcast.id.attributes["im:id"]);
  }, []);

  const getAttribute = (elements, key) => {
    let result = "";
    elements.map((d) => {
      if (d.name === key) {
        const type = d.elements[0].type;
        result = d.elements[0][type];
      }
    }) 
    return result;
  }

  return (
    <Container>
      {
        podcast &&
        <Row className="mt-4">
          <Col sm={12} md={4}>
              <Card
                style={{ minWidth: "18rem", cursor: "pointer" }}
                className="mb-2 shadow bg-white rounded border-0"
              >
                <div className="py-4 px-4">
                  <Image className="py-4 px-4 rounded-1" style={{ width: "100%", borderRadius: "10% !important" }} src={podcast["im:image"].length > 0 ? podcast["im:image"][podcast["im:image"].length - 1].label : ""} />
                </div>
                <Card.Body>
                  <hr className="text-muted" />
                  <Card.Title>{podcast["im:name"].label}</Card.Title>
                  <Card.Text className="text-muted" style={{fontStyle: "italic"}}>by {podcast["im:artist"].label}</Card.Text>
                </Card.Body>
                <Card.Body className="pt-0">
                  <hr className="text-muted" />
                  <Card.Text className="mb-0" style={{ fontWeight: "bold" }}>Description</Card.Text>
                  <Card.Text className="text-muted" style={{ fontStyle: "italic" }}>{podcast.summary.label}</Card.Text>
                </Card.Body>
              </Card>
          </Col>
          {
            episodes ?
              <Col sm={12} md={8}>
                  <Card.Header className="p-3 shadow bg-white rounded border-0">
                    <h4 className="m-0">Episodes: {episodes.length}</h4>
                  </Card.Header>
                  <Card
                    style={{ minWidth: "18rem", cursor: "pointer" }}
                    className="mb-2 shadow bg-white rounded border-0 p-4 mt-4"
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
                            const item = JSON.parse(convert.xml2json(`
                              <?xml version="1.0" encoding="utf-8"?> 
                              ${new XMLSerializer().serializeToString(e)}
                            `));
                            console.log(item.elements[0].elements);
                            const title = getAttribute(item.elements[0].elements, "title");
                            const date = getAttribute(item.elements[0].elements, "date");
                            const time = getAttribute(item.elements[0].elements, "itunes:duration");
                            return (
                              <tr key={i}>
                                <td>{title}</td>
                                <td><Moment date={date} format="DD/MM/YYYY" /></td>
                                <td>{time}</td>
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
                  <h4 className="m-0">No Episodes</h4>
                </Card.Header>
              </Col>
          }
        </Row>
      }
    </Container>
  );
}

export default PodcastDetail;
