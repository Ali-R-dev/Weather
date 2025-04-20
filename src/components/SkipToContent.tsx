import React from "react";

const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-blue-700 text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
    tabIndex={0}
  >
    Skip to main content
  </a>
);

export default SkipToContent;
