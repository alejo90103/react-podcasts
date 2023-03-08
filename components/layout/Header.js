import React from 'react';
import { Link } from "react-router-dom";
import { Container, Navbar } from 'react-bootstrap';

import {
  HOME,
  PODCAST_DETAIL,
  EPISODE_DETAIL
} from '../../routes/app/paths';

const Header = () => {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand href={HOME}>Navbar</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
