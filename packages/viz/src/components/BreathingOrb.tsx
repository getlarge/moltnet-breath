import { useMemo } from 'react';

interface Props {
  pm25: number;
  windSpeed: number;
  discharge: number | null;
  temperature: number;
  cityName: string;
  size?: number;
}

function pm25ToColor(val: number): string {
  if (val <= 5) return '#00d4c8';
  if (val <= 10) return '#4ddb8a';
  if (val <= 25) return '#e6a817';
  if (val <= 50) return '#e86830';
  return '#e83030';
}

function pm25ToBreathRate(val: number): number {
  return Math.max(1.5, 4 - (val / 50) * 2.5);
}

export function BreathingOrb({
  pm25,
  windSpeed,
  discharge,
  temperature,
  cityName,
  size = 300,
}: Props) {
  const color = useMemo(() => pm25ToColor(pm25), [pm25]);
  const breathRate = useMemo(() => pm25ToBreathRate(pm25), [pm25]);
  const pulseAmplitude = Math.min(15, windSpeed / 3);
  const riverWidth =
    discharge !== null ? Math.max(1, Math.min(6, discharge / 500)) : 0;

  const cx = size / 2;
  const orbR = size * 0.25;
  const ringR = size * 0.4;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, maxWidth: '100%' }}>
        <defs>
          <filter id={`glow-${cityName}`}>
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`grad-${cityName}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="70%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {discharge !== null && (
          <circle
            cx={cx}
            cy={cx}
            r={ringR}
            fill="none"
            stroke="#00d4c8"
            strokeWidth={riverWidth}
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values={`${ringR - 2};${ringR + 2};${ringR - 2}`}
              dur={`${breathRate * 1.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        )}

        <circle
          cx={cx}
          cy={cx}
          r={orbR}
          fill={`url(#grad-${cityName})`}
          filter={`url(#glow-${cityName})`}
        >
          <animate
            attributeName="r"
            values={`${orbR - pulseAmplitude};${orbR + pulseAmplitude};${orbR - pulseAmplitude}`}
            dur={`${breathRate}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
          />
        </circle>

        <circle cx={cx} cy={cx} r="4" fill="white" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.6;0.95;0.6"
            dur={`${breathRate}s`}
            repeatCount="indefinite"
          />
        </circle>

        <text
          x={cx}
          y={cx}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="18"
          fontFamily="JetBrains Mono, monospace"
          opacity="0.7"
        >
          {temperature.toFixed(1)}°C
        </text>
      </svg>
      <div
        style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 3,
          color: '#8888a0',
          marginTop: 8,
        }}
      >
        {cityName}
      </div>
    </div>
  );
}
