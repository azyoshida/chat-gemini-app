import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);

export const GeminiIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071 0 1.5 1.5 0 01-2.122 0 .75.75 0 00-1.07 0 1.5 1.5 0 01-2.122 0 .75.75 0 00-1.07 0 1.5 1.5 0 01-2.122 0A.75.75 0 001.29 3.357a1.5 1.5 0 010 2.121.75.75 0 000 1.071 1.5 1.5 0 010 2.121.75.75 0 000 1.071 1.5 1.5 0 010 2.121.75.75 0 000 1.071 1.5 1.5 0 010 2.121.75.75 0 001.07 1.071 1.5 1.5 0 012.122 0 .75.75 0 001.07 0 1.5 1.5 0 012.122 0 .75.75 0 001.07 0 1.5 1.5 0 012.122 0 .75.75 0 001.07 0 1.5 1.5 0 012.122 0 .75.75 0 001.07-1.071 1.5 1.5 0 010-2.121.75.75 0 000-1.071 1.5 1.5 0 010-2.121.75.75 0 000-1.071 1.5 1.5 0 010-2.121.75.75 0 000-1.071 1.5 1.5 0 010-2.121A.75.75 0 0021.644 2.286a1.5 1.5 0 01-2.122 0 .75.75 0 00-1.07 0 1.5 1.5 0 01-2.122 0 .75.75 0 00-1.07 0 1.5 1.5 0 01-2.122 0z"
      clipRule="evenodd"
    />
  </svg>
);


export const SendIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const ClearIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.5a.75.75 0 000 1.5h6a.75.75 0 00.75-.75v-6a.75.75 0 00-1.5 0v4.502l-1.903-1.903A9 9 0 003.75 12.55a.75.75 0 001.005-.491zM19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.5a.75.75 0 000-1.5h-6a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-4.502l1.903 1.903A9 9 0 0020.25 11.45a.75.75 0 00-1.005.491z"
      clipRule="evenodd"
    />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0l2.152.062c1.135.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h8.25m-8.25 0H6.375c-1.125 0-2.062.938-2.062 2.063v7.875c0 1.125.938 2.063 2.063 2.063h10.25c1.125 0 2.063-.938 2.063-2.063V9.563c0-1.125-.938-2.063-2.063-2.063H16.5"
    />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
