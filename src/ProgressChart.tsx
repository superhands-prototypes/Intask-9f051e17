import { useState } from 'react'

interface DataPoint {
  day: string
  value: number
  comparisonValue?: number
}

interface ProgressChartProps {
  data: DataPoint[]
  label?: string
}

export default function ProgressChart({ data, label = "This is a label" }: ProgressChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.comparisonValue || 0)))
  const yAxisLabels = ['0', '2k', '4k', '6k', '8k']
  const chartHeight = 100
  const chartWidth = 326
  const padding = { top: 16, right: 29, bottom: 27, left: 24 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const getY = (value: number) => {
    return padding.top + plotHeight - (value / maxValue) * plotHeight
  }

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * plotWidth
  }

  const createPath = (values: number[]) => {
    return values.map((value, index) => {
      const x = getX(index)
      const y = getY(value)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const createAreaPath = (values: number[]) => {
    const path = createPath(values)
    const firstX = getX(0)
    const lastX = getX(values.length - 1)
    const baseY = padding.top + plotHeight
    return `${path} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`
  }

  const primaryValues = data.map(d => d.value)
  const comparisonValues = data.map(d => d.comparisonValue || 0)

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (svgRect) {
      setTooltipPosition({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top
      })
    }
    setHoveredIndex(index)
  }

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null

  return (
    <div className="chart-card">
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
          {/* Y-axis labels */}
          <g className="y-axis">
            {yAxisLabels.map((label, index) => {
              const y = padding.top + (index / (yAxisLabels.length - 1)) * plotHeight
              return (
                <text
                  key={label}
                  x={10}
                  y={y + 3}
                  className="axis-label"
                >
                  {label}
                </text>
              )
            })}
          </g>

          {/* X-axis line */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + plotHeight}
            className="axis-line"
          />

          {/* X-axis labels */}
          <g className="x-axis">
            {data.map((point, index) => {
              const x = getX(index)
              return (
                <text
                  key={point.day}
                  x={x}
                  y={padding.top + plotHeight + 20}
                  className="axis-label"
                  textAnchor="middle"
                >
                  {point.day}
                </text>
              )
            })}
          </g>

          {/* Comparison line area (if exists) */}
          {data.some(d => d.comparisonValue) && (
            <>
              <path
                d={createAreaPath(comparisonValues)}
                className="chart-area comparison"
                fill="rgba(253, 221, 234, 0.3)"
              />
              <path
                d={createPath(comparisonValues)}
                className="chart-line comparison"
                stroke="#fdddea"
                strokeWidth="2"
                fill="none"
              />
            </>
          )}

          {/* Primary line area */}
          <path
            d={createAreaPath(primaryValues)}
            className="chart-area primary"
            fill="rgba(247, 90, 153, 0.2)"
          />

          {/* Primary line */}
          <path
            d={createPath(primaryValues)}
            className="chart-line primary"
            stroke="#f75a99"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = getX(index)
            const y = getY(point.value)
            const isHovered = hoveredIndex === index

            return (
              <g key={index}>
                {/* Invisible hover area */}
                <circle
                  cx={x}
                  cy={y}
                  r={15}
                  fill="transparent"
                  className="hover-area"
                  onMouseEnter={(e) => handleMouseMove(e, index)}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Data point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 4}
                  className={`data-point ${isHovered ? 'hovered' : ''}`}
                  fill="#ffffff"
                  stroke="#f75a99"
                  strokeWidth={isHovered ? 2.5 : 2}
                />
              </g>
            )
          })}

          {/* Comparison data points */}
          {data.some(d => d.comparisonValue) && data.map((point, index) => {
            if (!point.comparisonValue) return null
            const x = getX(index)
            const y = getY(point.comparisonValue)
            return (
              <circle
                key={`comp-${index}`}
                cx={x}
                cy={y}
                r={4}
                className="data-point comparison"
                fill="#ffffff"
                stroke="#fdddea"
                strokeWidth="2"
              />
            )
          })}

          {/* Hover indicator line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={padding.top + plotHeight}
              className="hover-line"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && hoveredData && (
          <div
            className="chart-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 60}px`,
            }}
          >
            <div className="tooltip-value primary">
              {hoveredData.value.toLocaleString()}m
            </div>
            {hoveredData.comparisonValue && (
              <div className="tooltip-value comparison">
                {hoveredData.comparisonValue.toLocaleString()}m
              </div>
            )}
          </div>
        )}
      </div>

      {label && (
        <div className="chart-label">
          {label}
        </div>
      )}
    </div>
  )
}
