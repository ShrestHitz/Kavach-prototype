// High-resolution SVG World Map Watermark matching Kochi Metro "Explore the Network" background
export default function WorldMapWatermark({
  opacity = 0.18,
  color = '#7E9DB9'
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
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
        fill="none"
      >
        {/* Subtle Lat/Long Graticule Grid Lines matching authentic map watermark */}
        <g stroke={color} strokeWidth="0.5" strokeDasharray="3 6" opacity="0.35">
          <line x1="0" y1="125" x2="1000" y2="125" />
          <line x1="0" y1="250" x2="1000" y2="250" />
          <line x1="0" y1="375" x2="1000" y2="375" />
          <path d="M 200,0 Q 250,250 200,500" />
          <path d="M 400,0 Q 450,250 400,500" />
          <path d="M 600,0 Q 650,250 600,500" />
          <path d="M 800,0 Q 850,250 800,500" />
        </g>

        {/* Detailed Continent Silhouettes */}
        <g fill={color} stroke={color} strokeWidth="0.8">
          {/* North America */}
          <path d="M 110,65 Q 160,45 220,55 Q 265,75 295,115 Q 315,155 265,185 Q 225,205 205,235 Q 185,265 175,295 Q 155,285 145,255 Q 125,225 105,185 Q 85,135 110,65 Z" opacity="0.88" />
          <path d="M 255,45 Q 310,35 365,55 Q 345,85 295,85 Z" opacity="0.75" /> {/* Greenland */}
          <path d="M 165,255 Q 185,275 195,315 Q 165,325 145,295 Z" opacity="0.8" /> {/* Central America */}
          <path d="M 125,45 Q 145,35 155,50 Q 135,55 125,45 Z" opacity="0.7" /> {/* Alaska Islands */}

          {/* South America */}
          <path d="M 205,315 Q 245,315 285,345 Q 325,385 305,435 Q 275,475 245,485 Q 215,445 205,395 Q 195,345 205,315 Z" opacity="0.88" />
          <path d="M 235,485 Q 255,485 245,498 Q 230,495 235,485 Z" opacity="0.75" /> {/* Tierra del Fuego */}

          {/* Europe & British Isles */}
          <path d="M 465,85 Q 515,65 555,75 Q 575,105 535,135 Q 495,145 465,125 Q 455,105 465,85 Z" opacity="0.88" />
          <path d="M 435,90 Q 450,85 445,110 Q 430,110 435,90 Z" opacity="0.8" /> {/* UK */}
          <path d="M 475,45 Q 525,35 555,60 Q 525,75 475,55 Z" opacity="0.85" /> {/* Scandinavia */}
          <path d="M 415,65 Q 435,55 440,70 Q 420,75 415,65 Z" opacity="0.7" /> {/* Iceland */}

          {/* Africa */}
          <path d="M 465,155 Q 545,155 575,205 Q 605,265 565,325 Q 535,375 495,365 Q 465,315 445,255 Q 435,195 465,155 Z" opacity="0.88" />
          <path d="M 570,295 Q 585,295 590,325 Q 575,340 570,315 Z" opacity="0.8" /> {/* Madagascar */}

          {/* Asia & Indian Subcontinent */}
          <path d="M 555,75 Q 655,55 785,65 Q 855,105 885,165 Q 855,215 785,235 Q 715,225 675,175 Q 625,155 575,125 Z" opacity="0.88" />
          <path d="M 635,165 Q 685,175 705,215 Q 695,255 665,285 Q 645,275 625,245 Q 615,195 635,165 Z" opacity="0.95" /> {/* India & South Asia */}
          <path d="M 665,290 Q 675,290 673,305 Q 660,305 665,290 Z" opacity="0.85" /> {/* Sri Lanka */}
          <path d="M 775,175 Q 835,185 845,235 Q 805,255 765,225 Z" opacity="0.82" /> {/* Southeast Asia */}
          <path d="M 780,240 Q 820,245 840,265 Q 810,280 775,260 Z" opacity="0.8" /> {/* Indonesia / Malay archipelago */}
          <path d="M 845,115 Q 865,115 860,155 Q 840,145 845,115 Z" opacity="0.78" /> {/* Japan */}

          {/* Australia & Oceania */}
          <path d="M 765,325 Q 835,315 875,355 Q 865,405 815,425 Q 755,405 745,365 Q 745,335 765,325 Z" opacity="0.88" />
          <path d="M 885,405 Q 905,405 910,435 Q 890,440 885,415 Z" opacity="0.78" /> {/* New Zealand */}
          <path d="M 810,430 Q 825,430 822,445 Q 810,445 810,430 Z" opacity="0.75" /> {/* Tasmania */}
        </g>
      </svg>
    </div>
  )
}
