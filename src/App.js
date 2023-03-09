import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Layout from './components/layout/Layout';
import { publicRoutes } from "./routes/app/routes";
import LoadingContextProvider from "./contexts/loadingContext";

// PODCASTS
// import Podcasts from './components/podcasts/Podcasts';
// import PodcastDetail from './components/podcasts/PodcastDetail';

function App() {
  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <React.Fragment>
        <LoadingContextProvider>
          <Suspense fallback={true}>
            <Router>
              <Routes>
                {/* <Route key={1} exact path={"/"} element={<Layout><Podcasts /></Layout>} />
                <Route key={2} exact path={"/podcast/:id"} element={<Layout><PodcastDetail /></Layout>} /> */}
                {publicRoutes.map((route, idx) => (
                  <Route key={idx} exact path={route.path} element={<Layout>{route.component}</Layout>} />
                ))}
              </Routes>
            </Router>
          </Suspense>
        </LoadingContextProvider>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;