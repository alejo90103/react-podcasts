import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

import './App.css';
import Layout from './components/layout/Layout';
import FallbackError from './components/layout/FallbackError';
import { publicRoutes } from "./routes/app/routes";
import LoadingContextProvider from "./contexts/loadingContext";



const App: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackError}
    >
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <React.Fragment>
          <LoadingContextProvider>
            <Suspense fallback={true}>
              <Router>
                <Routes>
                  {publicRoutes.map((route, idx) => (
                    <Route 
                      key={idx} 
                      path={route.path} 
                      element={
                        <Layout>
                          {route.component}
                        </Layout>
                      } 
                    />
                  ))}
                </Routes>
              </Router>
            </Suspense>
          </LoadingContextProvider>
        </React.Fragment>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;