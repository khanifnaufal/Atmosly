type Props = {
  variant?: 'default' | 'icon';
  size?: number;
};

export const Logo = ({ variant = 'default', size = 32 }: Props) => {
  if (variant === 'default') {
    return (
      <svg
        data-logo='logo'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 200 40'
        height={size}
      >
        {/* Cloud Icon (Logogram) */}
        <g id='logogram' transform='translate(0, 2) scale(0.35)'>
          <defs>
            <linearGradient id='logo-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#48CAE4'/>
              <stop offset='100%' stopColor='#0077B6'/>
            </linearGradient>
          </defs>
          <rect width='100' height='100' rx='22' fill='url(#logo-gradient)'/>
          <ellipse cx='50' cy='62' rx='28' ry='13' fill='#ffffff'/>
          <circle cx='36' cy='56' r='13' fill='#ffffff'/>
          <circle cx='51' cy='50' r='17' fill='#ffffff'/>
          <circle cx='66' cy='56' r='11' fill='#ffffff'/>
          <rect x='22' y='78' width='24' height='4' rx='2' fill='#ffffff' fillOpacity='0.5'/>
          <rect x='26' y='85' width='16' height='4' rx='2' fill='#ffffff' fillOpacity='0.35'/>
        </g>
        
        {/* Text (Logotype) */}
        <text
          x='45'
          y='28'
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '24px',
            fill: 'var(--foreground)'
          }}
        >
          Atmosly
        </text>
      </svg>
    );
  } else {
    return (
      <svg
        data-logo='logo'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 100 100'
        height={size}
        width={size}
      >
        <defs>
          <linearGradient id='logo-gradient-icon' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#48CAE4'/>
            <stop offset='100%' stopColor='#0077B6'/>
          </linearGradient>
        </defs>
        <rect width='100' height='100' rx='22' fill='url(#logo-gradient-icon)'/>
        <ellipse cx='50' cy='62' rx='28' ry='13' fill='#ffffff'/>
        <circle cx='36' cy='56' r='13' fill='#ffffff'/>
        <circle cx='51' cy='50' r='17' fill='#ffffff'/>
        <circle cx='66' cy='56' r='11' fill='#ffffff'/>
        <rect x='22' y='78' width='24' height='4' rx='2' fill='#ffffff' fillOpacity='0.5'/>
        <rect x='26' y='85' width='16' height='4' rx='2' fill='#ffffff' fillOpacity='0.35'/>
      </svg>
    );
  }
};