import React from 'react';
import { screen, render } from "@testing-library/react";

import Podcasts from "./Podcasts";

describe('Podcasts Page', () => {
  it("must display text", () => {
    render(<Podcasts />);
    expect(screen.queryByText(/podcats/i)).toBeInTheDocument();
  })
});
