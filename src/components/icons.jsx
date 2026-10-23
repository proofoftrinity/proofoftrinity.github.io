import React from 'react';

// Minimal stroke icons for cards and controls, in the same style as the card
// chevron in HomepageComponents.jsx: 24px viewBox, currentColor, 1.5 stroke.

const Icon = ({children}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    {children}
  </svg>
);

export const GlobeIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
  </Icon>
);

export const RouteIcon = () => (
  <Icon>
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M7 6h5a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
  </Icon>
);

export const ShieldIcon = () => (
  <Icon>
    <path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9.5c-4.1-1.9-7-5.3-7-9.5V6l7-3z" />
    <path d="M9 12l2 2l4-4" />
  </Icon>
);

export const SplitIcon = () => (
  <Icon>
    <path d="M4 12h4l4-6h8" />
    <path d="M8 12l4 6h8" />
    <path d="M17 3l3 3l-3 3" />
    <path d="M17 15l3 3l-3 3" />
  </Icon>
);

export const KeyIcon = () => (
  <Icon>
    <circle cx="8" cy="8" r="4" />
    <path d="M11 11l9 9" />
    <path d="M17 17l2-2" />
    <path d="M14 14l2-2" />
  </Icon>
);

export const ServerIcon = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </Icon>
);

export const DownloadIcon = () => (
  <Icon>
    <path d="M12 4v11" />
    <path d="M7 10l5 5l5-5" />
    <path d="M5 20h14" />
  </Icon>
);

export const ExpandIcon = () => (
  <Icon>
    <path d="M15 4h5v5" />
    <path d="M9 20H4v-5" />
    <path d="M20 4l-6 6" />
    <path d="M4 20l6-6" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Icon>
);

export const ChevronLeftIcon = () => (
  <Icon>
    <path d="M15 5l-7 7l7 7" />
  </Icon>
);

export const ChevronRightIcon = () => (
  <Icon>
    <path d="M9 5l7 7l-7 7" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
