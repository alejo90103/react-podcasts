import React from 'react';
import PropTypes from 'prop-types';
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

Layout.defaultProps = {
  children: null,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;