import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Card, Image } from 'react-bootstrap';

import { PODCAST } from '../../routes/app/paths';

const PodcastCard = ({ podcast, navigateBack=false }) => {
  const navigate = useNavigate();

  const handlePodcastDetail = () => {
    navigate(`${PODCAST}/${podcast.id.attributes["im:id"]}`, {
      state: { podcast }
    });
  }

  return (
    <Card
      style={{ minWidth: "18rem" }}
      className="mb-2 shadow bg-white rounded border-0"
    >
      <div className={`py-4 px-4 ${navigateBack && "cursor-pointer"}`} onClick={() => navigateBack && handlePodcastDetail()}>
        <Image className="py-4 px-4 rounded-1" style={{ width: "100%", borderRadius: "10% !important" }} src={podcast["im:image"].length > 0 ? podcast["im:image"][podcast["im:image"].length - 1].label : ""} />
      </div>
      <Card.Body>
        <hr className="text-muted" />
        <Card.Title className={`${navigateBack && "cursor-pointer"}`} onClick={() => navigateBack && handlePodcastDetail()}>{podcast["im:name"].label}</Card.Title>
        <Card.Text className={`text-muted font-italic ${navigateBack && "cursor-pointer"}`} onClick={() => navigateBack && handlePodcastDetail()}>by {podcast["im:artist"].label}</Card.Text>
      </Card.Body>
      <Card.Body className="pt-0">
        <hr className="text-muted" />
        <Card.Text className="mb-0 font-bold">Description</Card.Text>
        <Card.Text className="text-muted font-italic">{podcast.summary.label}</Card.Text>
      </Card.Body>
    </Card>
  );
}

PodcastCard.defaultProps = {
  navigateBack: false,
};

PodcastCard.propTypes = {
  podcast: PropTypes.object.isRequired,
  navigateBack: PropTypes.boolean
};

export default PodcastCard;
