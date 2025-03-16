import React from "react";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-auto z-10 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Privacy Policy
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Last Updated: March 16, 2025
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Our Weather App (“we”, “us”, or “our”) uses your IP address solely to
          determine your approximate location in real‑time in order to display
          local weather information. No personal data is stored or shared.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <strong>Information Usage:</strong> Your IP address is used only to
          retrieve weather data relevant to your location. This information is
          processed immediately and not stored.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <strong>Data Security:</strong> We implement technical measures to
          secure your data in transit. However, no internet transmission is 100%
          secure.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <strong>Your Rights:</strong> As we do not collect or store personal
          information beyond what is required for real‑time functionality, there
          is no persistent data you need to manage.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          For any questions regarding our privacy practices, please email:{" "}
          <a href="mailto:your-email@example.com" className="underline">
            your-email@example.com
          </a>
          .
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
