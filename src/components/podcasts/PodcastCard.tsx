import React from 'react';
import { Card, Image, Col } from 'react-bootstrap';

import { PODCAST } from '../../routes/app/paths';
import { Podcast } from '../../models/Podcast';
interface PodcastCardProps {
  key: number;
  podcast: Podcast;
  handleDetail: (podcast: Podcast) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ key, podcast, handleDetail }) => {
  return (
    <Col key={key} className='p-3 my-4'>
      <Card
        style={{ minWidth: "18rem" }}
        className="mb-2 shadow bg-white rounded text-center border-0 cursor-pointer"
        onClick={() => handleDetail(podcast)}
      >
        <div className="image-postcast">
          <Image roundedCircle src={podcast["im:image"].length > 0 ? podcast["im:image"][podcast["im:image"].length - 1].label : "" } />
        </div>
        <Card.Body style={{ marginTop: 60 }}>
          <Card.Title>{podcast["im:name"].label}</Card.Title>
          <Card.Text className="text-muted">Author: {podcast["im:artist"].label}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PodcastCard;