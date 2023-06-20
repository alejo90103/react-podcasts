import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Spinner } from 'react-bootstrap';

import { HOME } from '../../routes/app/paths';
import useLoadingContext from '../../hooks/useLoadingContext';

const Header = () => {
  const navigate = useNavigate();
  const { loading } = useLoadingContext();

  return (
    <Navbar expand="lg" variant="light" bg="light" sticky="top" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigate(HOME)} className="text-info cursor-pointer">Podcaster</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          { loading && <Spinner animation="grow" variant="info" /> }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
