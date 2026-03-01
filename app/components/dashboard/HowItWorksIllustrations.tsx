/**
 * unDraw-style illustrations for the How It Works section.
 * Inspired by https://undraw.co/illustrations
 * Colors: primary #1c4471, accent #f3ae3d, light #d4e1f3
 */

const illustrationBaseProps = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  className: "w-full h-auto",
};

export function DescribeSituationIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <rect x="50" y="50" width="100" height="60" rx="4" fill="#fff" stroke="#1c4471" strokeWidth="2" />
        <path d="M60 68h80M60 80h60M60 92h40" stroke="#9ca6b6" strokeWidth="2" strokeLinecap="round" />
        <rect x="35" y="75" width="35" height="45" rx="4" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1.5" />
        <path d="M42 88h21M42 95h21M42 102h14" stroke="#1c4471" strokeWidth="1" strokeLinecap="round" />
        <path d="M42 115v5h21v-5" stroke="#1c4471" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="130" cy="95" r="28" fill="#f3ae3d" opacity="0.2" stroke="#f3ae3d" strokeWidth="2" />
        <path d="M118 95l8 8 16-16" stroke="#f3ae3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function AIAnalyzesIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <circle cx="100" cy="55" r="35" fill="#d4e1f3" stroke="#1c4471" strokeWidth="2" />
        <path d="M85 45l8 8 16-16M92 62l5 5 10-10" stroke="#1c4471" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="55" r="8" fill="#f3ae3d" />
        <path d="M50 100h20v-15H50zM90 100h20v-15H90zM130 100h20v-15H130z" fill="#fff" stroke="#1c4471" strokeWidth="1.5" rx="2" />
        <path d="M55 112h10M95 112h10M135 112h10" stroke="#9ca6b6" strokeWidth="1" strokeLinecap="round" />
        <path d="M55 55v35M90 55v35M110 55v35M145 55v35" stroke="#1c4471" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
      </g>
    </svg>
  );
}

export function ClearInsightsDocsIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <circle cx="70" cy="50" r="30" fill="#23c4b4" opacity="0.2" stroke="#23c4b4" strokeWidth="2" />
        <path d="M55 50l10 10 20-20" stroke="#23c4b4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="95" y="25" width="75" height="95" rx="4" fill="#fff" stroke="#1c4471" strokeWidth="2" />
        <rect x="105" y="40" width="55" height="6" rx="2" fill="#245588" />
        <path d="M105 58h55M105 72h55M105 86h40" stroke="#9ca6b6" strokeWidth="2" strokeLinecap="round" />
        <rect x="30" y="95" width="50" height="35" rx="2" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1.5" />
        <path d="M37 105h36M37 112h36M37 119h24" stroke="#1c4471" strokeWidth="1" strokeLinecap="round" />
        <circle cx="155" cy="105" r="12" fill="#f3ae3d" opacity="0.3" stroke="#f3ae3d" strokeWidth="1.5" />
        <path d="M149 105l4 4 8-8" stroke="#f3ae3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
