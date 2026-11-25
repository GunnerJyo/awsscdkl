// Adapted from Magic UI Striped Pattern. See public/licenses/component-sources.txt.
import { useId, type SVGProps } from 'react'

type StripedPatternProps = SVGProps<SVGSVGElement> & {
  direction?: 'left' | 'right'
  spacing?: number
}

export function StripedPattern({ direction = 'left', spacing = 8, ...props }: StripedPatternProps) {
  const patternId = useId()
  const startY = direction === 'left' ? spacing : 0
  const endY = direction === 'left' ? 0 : spacing

  return <svg width="100%" height="100%" strokeWidth="1" {...props} aria-hidden="true" focusable="false">
    <defs>
      <pattern id={patternId} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
        {[-spacing, 0, spacing].map(x =>
          <line key={x} x1={x} x2={x + spacing} y1={startY} y2={endY} stroke="currentColor"/>,
        )}
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`}/>
  </svg>
}
