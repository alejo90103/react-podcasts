import React from 'react';
import { Container } from 'react-bootstrap';

import Header from "./Header";

const Layout = (props) => {
  return (
    <React.Fragment>
      <Container fluid>
        <Header />
        <div className="main-content">
          {props.children}
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Layout;
