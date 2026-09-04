// High-resolution SVG World Map Watermark matching Kochi Metro "Explore the Network" background
export default function WorldMapWatermark({
  opacity = 0.20,
}: {
  opacity?: number
  color?: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <img
        src="/world-map.svg"
        alt="World Map Silhouette"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  )
}
