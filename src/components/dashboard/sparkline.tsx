type SparklineVariant = "active-contracts" | "contracts-at-risk" | "portfolio-margin" | "on-time-delivery";

const PATHS: Record<SparklineVariant, string> = {
  "active-contracts":  "M0,28 C8,20 16,30 28,22 C38,16 50,26 64,18",
  "contracts-at-risk": "M0,22 C8,30 18,18 28,26 C40,16 52,28 64,20",
  "portfolio-margin":  "M0,20 C8,24 18,18 30,26 C42,30 52,26 64,34",
  "on-time-delivery":  "M0,18 C10,22 20,20 32,28 C44,32 54,36 64,40",
};

interface SparklineProps {
  variant: SparklineVariant;
}

export default function Sparkline({ variant }: SparklineProps) {
  return (
    <svg width="64" height="54" viewBox="0 0 64 54" fill="none">
      <path
        d={PATHS[variant]}
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
