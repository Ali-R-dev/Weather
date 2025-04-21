import React from 'react';

interface ViewToggleProps {
  expandedView: boolean;
  toggleView: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ expandedView, toggleView }) => {
  return (
    <div className="mt-3 flex justify-center" role="tablist" aria-label="Forecast view toggle">
      <button
        onClick={toggleView}
        className={`px-4 py-1.5 rounded-full font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 transition-all ${
          expandedView ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/15'
        }`}
        role="tab"
        aria-selected={expandedView}
        tabIndex={expandedView ? 0 : -1}
      >
        {expandedView ? 'Show 24 Hours' : 'Show 48 Hours'}
      </button>
    </div>
  );
};

export default ViewToggle;
