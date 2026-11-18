import { useState } from 'react';

interface Shot {
  loc_x: number;
  loc_y: number;
  shot_made_flag: 0 | 1;
  action_type: string;
  shot_zone_basic: string;
  shot_distance: number;
}

interface DummyPlayer {
  id: number;
  name: string;
  shots: Shot[];
}

function generateZoneShots(
  count: number,
  centerX: number,
  centerY: number,
  spreadX: number,
  spreadY: number,
  makeRate: number,
  actionType: string,
  zoneBasic: string,
  distance: number
): Shot[] {
  return Array.from({ length: count }, (_, i) => {
    const offsetX = Math.sin(i * 12.9898 + centerX) * spreadX;
    const offsetY = Math.cos(i * 78.233 + centerY) * spreadY;
    const isMade = ((i * 7 + Math.abs(centerX)) % 100) / 100 < makeRate ? 1 : 0;

    return {
      loc_x: Math.round(centerX + offsetX),
      loc_y: Math.round(centerY + offsetY),
      shot_made_flag: isMade,
      action_type: actionType,
      shot_zone_basic: zoneBasic,
      shot_distance: distance,
    };
  });
}

const DUMMY_PLAYERS: DummyPlayer[] = [
  {
    id: 201939,
    name: 'Stephen Curry (Perimeter)',
    shots: [
      ...generateZoneShots(18, 0, 265, 95, 25, 0.44, 'Step Back Jump shot', 'Above the Break 3', 27),
      ...generateZoneShots(14, -175, 195, 35, 30, 0.41, 'Pullup Jump shot', 'Above the Break 3', 26),
      ...generateZoneShots(14, 175, 195, 35, 30, 0.43, 'Jump Shot', 'Above the Break 3', 26),
      ...generateZoneShots(8, -228, 22, 8, 35, 0.48, 'Catch and Shoot 3PT', 'Right Corner 3', 23),
      ...generateZoneShots(8, 228, 22, 8, 35, 0.46, 'Catch and Shoot 3PT', 'Left Corner 3', 23),
      ...generateZoneShots(15, 0, 18, 22, 18, 0.64, 'Driving Reverse Layup Shot', 'Restricted Area', 2),
      ...generateZoneShots(7, -85, 115, 25, 25, 0.48, 'Floating Jump shot', 'In The Paint (Non-RA)', 12),
    ],
  },
  {
    id: 203507,
    name: 'Giannis Antetokounmpo (Paint)',
    shots: [
      ...generateZoneShots(48, 0, 16, 28, 22, 0.72, 'Driving Dunk Shot', 'Restricted Area', 2),
      ...generateZoneShots(16, -25, 65, 30, 25, 0.46, 'Turnaround Hook Shot', 'In The Paint (Non-RA)', 8),
      ...generateZoneShots(10, 95, 105, 30, 30, 0.36, 'Fadeaway Jump Shot', 'Mid-Range', 14),
      ...generateZoneShots(6, 0, 255, 60, 15, 0.28, 'Jump Shot', 'Above the Break 3', 26),
    ],
  },
  {
    id: 201942,
    name: 'DeMar DeRozan (Mid-Range)',
    shots: [
      ...generateZoneShots(22, -135, 95, 35, 35, 0.49, 'Pullup Jump shot', 'Mid-Range', 16),
      ...generateZoneShots(22, 135, 95, 35, 35, 0.48, 'Turnaround Fadeaway shot', 'Mid-Range', 16),
      ...generateZoneShots(16, 0, 145, 45, 25, 0.51, 'Pullup Jump shot', 'Mid-Range', 15),
      ...generateZoneShots(20, 0, 20, 25, 20, 0.65, 'Driving Layup Shot', 'Restricted Area', 3),
      ...generateZoneShots(6, -226, 15, 6, 25, 0.35, 'Jump Shot', 'Right Corner 3', 23),
    ],
  },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMakes, setShowMakes] = useState(true);
  const [showMisses, setShowMisses] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentPlayer = DUMMY_PLAYERS[selectedIndex];
  const hoveredShot = hoveredIdx !== null ? currentPlayer.shots[hoveredIdx] : null;
  const madeCount = currentPlayer.shots.filter((s) => s.shot_made_flag === 1).length;
  const missedCount = currentPlayer.shots.length - madeCount;
  const calculatedFg = ((madeCount / currentPlayer.shots.length) * 100).toFixed(1);
  const courtLineColor = '#475569';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight text-orange-500">
        NBA Mystery Shot Chart
      </h1>
      <p className="text-slate-400 text-sm mt-1 mb-6">
        Hover over any shot to inspect the play details
      </p>

      {/* Player Switcher */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {DUMMY_PLAYERS.map((player, idx) => (
          <button
            key={player.id}
            onClick={() => {
              setSelectedIndex(idx);
              setHoveredIdx(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selectedIndex === idx
                ? 'bg-orange-500 border-orange-400 text-slate-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      {/* Filter Toggles & FG% */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
        <button
          onClick={() => setShowMakes(!showMakes)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
            showMakes
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
        >
          ● Makes ({madeCount})
        </button>

        <button
          onClick={() => setShowMisses(!showMisses)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
            showMisses
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
        >
          ✕ Misses ({missedCount})
        </button>

        <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
          FG%: {madeCount}/{currentPlayer.shots.length} ({calculatedFg}%)
        </span>
      </div>

      {/* Basketball Court SVG */}
      <div className="relative w-full max-w-2xl mx-auto">
        {hoveredShot && (
          <div className="absolute top-3 right-3 z-10 rounded-lg bg-slate-900/95 border border-slate-700 px-3 py-2 text-xs text-slate-200 shadow-lg pointer-events-none">
            <p className="font-semibold text-white">
              {hoveredShot.shot_made_flag === 1 ? '✅ Made Shot' : '❌ Missed Shot'}
            </p>
            <p>{hoveredShot.action_type}</p>
            <p className="text-slate-400">
              {hoveredShot.shot_zone_basic} ({hoveredShot.shot_distance} ft)
            </p>
          </div>
        )}

        <svg
          viewBox="-250 -52.5 500 470"
          className="w-full h-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl"
        >
          {/* Outer Half-Court Boundary */}
          <rect x={-250} y={-52.5} width={500} height={470} fill="none" stroke={courtLineColor} strokeWidth={2} />

          {/* Paint / Key */}
          <rect x={-80} y={-52.5} width={160} height={190} fill="none" stroke={courtLineColor} strokeWidth={2} />

          {/* Inner Paint Lane */}
          <rect x={-60} y={-52.5} width={120} height={190} fill="none" stroke={courtLineColor} strokeWidth={1.5} />

          {/* Free Throw Circle */}
          <path d="M -60 137.5 A 60 60 0 0 0 60 137.5" fill="none" stroke={courtLineColor} strokeWidth={2} />
          <path d="M -60 137.5 A 60 60 0 0 1 60 137.5" fill="none" stroke={courtLineColor} strokeWidth={2} strokeDasharray="8 8" />

          {/* Restricted Area Arc */}
          <path d="M -40 0 A 40 40 0 0 0 40 0" fill="none" stroke={courtLineColor} strokeWidth={2} />

          {/* Three-Point Line */}
          <path d="M -220 -52.5 L -220 89.48 A 237.5 237.5 0 0 0 220 89.48 L 220 -52.5" fill="none" stroke={courtLineColor} strokeWidth={2} />

          {/* Center Court Circle */}
          <path d="M -60 417.5 A 60 60 0 0 1 60 417.5" fill="none" stroke={courtLineColor} strokeWidth={2} />

          {/* Backboard & Rim */}
          <line x1={-30} y1={-12.5} x2={30} y2={-12.5} stroke="#94a3b8" strokeWidth={3} />
          <circle cx={0} cy={0} r={7.5} fill="none" stroke="#f97316" strokeWidth={2.5} />

          {/* Shot Markers */}
          <g>
            {currentPlayer.shots.map((shot, idx) => {
              const isMade = shot.shot_made_flag === 1;
              if (isMade && !showMakes) return null;
              if (!isMade && !showMisses) return null;

              const cx = -shot.loc_x;
              const cy = shot.loc_y;
              const isHovered = hoveredIdx === idx;

              return isMade ? (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4.5}
                  fill={isHovered ? '#34d399' : '#10b981'}
                  fillOpacity={isHovered ? 1 : 0.85}
                  stroke={isHovered ? '#ffffff' : '#064e3b'}
                  strokeWidth={isHovered ? 1.5 : 1}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ) : (
                <g
                  key={idx}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle r={6} fill="transparent" />
                  <line
                    x1={isHovered ? -4.5 : -3.5}
                    y1={isHovered ? -4.5 : -3.5}
                    x2={isHovered ? 4.5 : 3.5}
                    y2={isHovered ? 4.5 : 3.5}
                    stroke={isHovered ? '#ffffff' : '#f43f5e'}
                    strokeWidth={isHovered ? 2.4 : 1.8}
                    strokeOpacity={isHovered ? 1 : 0.75}
                  />
                  <line
                    x1={isHovered ? 4.5 : 3.5}
                    y1={isHovered ? -4.5 : -3.5}
                    x2={isHovered ? -4.5 : -3.5}
                    y2={isHovered ? 4.5 : 3.5}
                    stroke={isHovered ? '#ffffff' : '#f43f5e'}
                    strokeWidth={isHovered ? 2.4 : 1.8}
                    strokeOpacity={isHovered ? 1 : 0.75}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}