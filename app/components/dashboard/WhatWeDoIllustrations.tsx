/**
 * unDraw-style illustrations for the What We Do section.
 * Inspired by https://undraw.co/illustrations
 * Colors: primary #1c4471, accent #f3ae3d, light #d4e1f3
 */

const illustrationBaseProps = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  className: "w-full h-auto",
};

export function SituationAnalysisIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <rect x="40" y="30" width="120" height="90" rx="6" fill="#fff" stroke="#1c4471" strokeWidth="2" />
        <path d="M55 55h90M55 72h70M55 89h50" stroke="#4f5b6e" strokeWidth="2" strokeLinecap="round" />
        <circle cx="155" cy="75" r="25" fill="#23c4b4" opacity="0.3" stroke="#23c4b4" strokeWidth="2" />
        <path d="M145 75l6 6 14-14" stroke="#23c4b4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="80" r="22" fill="#f3ae3d" opacity="0.2" stroke="#f3ae3d" strokeWidth="2" />
        <line x1="50" y1="95" x2="75" y2="115" stroke="#f3ae3d" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function NextMovesIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <path d="M100 20v35l-25 25 25 25v35" stroke="#1c4471" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="55" r="12" fill="#f3ae3d" stroke="#f3ae3d" strokeWidth="2" />
        <path d="M75 80l-15-15 15-15M125 80l15-15-15-15" stroke="#1c4471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <circle cx="60" cy="95" r="8" fill="#d4e1f3" />
        <circle cx="100" cy="110" r="8" fill="#d4e1f3" />
        <circle cx="140" cy="95" r="8" fill="#d4e1f3" />
        <path d="M60 95v15M100 110v0M140 95v15" stroke="#1c4471" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}

export function CourtDocsIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <rect x="55" y="20" width="90" height="100" rx="4" fill="#fff" stroke="#1c4471" strokeWidth="2" />
        <rect x="65" y="35" width="70" height="8" rx="2" fill="#245588" />
        <path d="M65 55h70M65 70h70M65 85h50" stroke="#9ca6b6" strokeWidth="2" strokeLinecap="round" />
        <rect x="40" y="45" width="25" height="35" rx="2" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1.5" />
        <path d="M47 58h11M47 65h11M47 72h6" stroke="#1c4471" strokeWidth="1" strokeLinecap="round" />
        <circle cx="130" cy="105" r="18" fill="#23c4b4" />
        <path d="M120 105l6 6 12-12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ExitStrategyIllus() {
  return (
    <svg viewBox="0 0 200 140" {...illustrationBaseProps}>
      <g fill="none" fillRule="evenodd">
        <path d="M30 100h50v-30l20 20-20 20v-30H30z" fill="#d4e1f3" stroke="#1c4471" strokeWidth="2" strokeLinejoin="round" />
        <path d="M90 70l25-25 25 25-25 25z" fill="#fff" stroke="#1c4471" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="115" cy="70" r="6" fill="#f3ae3d" />
        <path d="M140 95v15M160 110h-40M120 125v-15" stroke="#1c4471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <circle cx="140" cy="95" r="5" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1" />
        <circle cx="160" cy="110" r="5" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1" />
        <circle cx="120" cy="125" r="5" fill="#d4e1f3" stroke="#1c4471" strokeWidth="1" />
      </g>
    </svg>
  );
}
