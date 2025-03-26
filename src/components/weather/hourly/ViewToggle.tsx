import React from "react";

interface ViewToggleProps {
  expandedView: boolean;
  toggleView: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  expandedView,
  toggleView,
}) => {
  return (
    <div className="mt-3 flex justify-center">
      <button
        onClick={toggleView}
        className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white hover:bg-white/15 transition-all"
      >
        {expandedView ? "Show 24 Hours" : "Show 48 Hours"}
      </button>
    </div>
  );
};

export default ViewToggle;
