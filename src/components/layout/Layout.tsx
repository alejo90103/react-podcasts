import React, { ReactNode } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Container } from 'react-bootstrap';

import Header from './Header';

type LayoutProps = {
  children?: ReactNode;
};

const Layout: React.FC<LayoutProps> = (props: InferProps<LayoutProps>) => {
  return (
    <React.Fragment>
      <Container fluid>
        <Header />
        <div className="main-content">{props.children}</div>
      </Container>
    </React.Fragment>
  );
};

Layout.defaultProps = {
  children: null,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;