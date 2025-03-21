import React from "react";

interface FooterProps {
  onShowPrivacyModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacyModal }) => {
  return (
    <footer className="w-full py-4 px-6 bg-white/5 backdrop-blur-sm mt-auto border-t border-white/10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/70">
        <div className="flex items-center space-x-2">
          <span>© 2025 Weather App</span>
          <span className="hidden md:inline">•</span>
          <a
            href="https://araza.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors hover:underline"
          >
            Created by Ali Raza
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors hover:underline"
          >
            Powered by Open-Meteo
          </a>
          <span>•</span>
          <button
            onClick={onShowPrivacyModal}
            className="hover:text-white transition-colors hover:underline"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
