import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Navbar } from 'react-bootstrap';

import { HOME } from '../../routes/app/paths';

const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand onClick={() => navigate(HOME)} className="text-info cursor-pointer">Podcaster</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
