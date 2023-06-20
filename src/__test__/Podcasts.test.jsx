import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

// components
import Header from '../components/layout/Header';
import LoadingContextProvider from "../contexts/loadingContext";

const RouterWrapper = ({ children }) => {
  return (
    <LoadingContextProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </LoadingContextProvider>
  );
};

beforeAll(() => {
  // Mock matchMedia
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(), // For older versions of Jest
    removeListener: jest.fn(), // For older versions of Jest
    addEventListener: jest.fn(), // For newer versions of Jest
    removeEventListener: jest.fn(), // For newer versions of Jest
    dispatchEvent: jest.fn(),
  }));
});

describe('podcasts view', () => {
  test("title 'Podcaster'", () => {
    render(<Header />, { wrapper: RouterWrapper });
    const title = screen.getByText(/Podcaster/i);
    expect(title).toBeInTheDocument();
  });
});