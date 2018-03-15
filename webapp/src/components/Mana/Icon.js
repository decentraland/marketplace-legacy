import React from 'react'

const Icon = ({ width, height }) => (
  <svg
    className="ManaIcon"
    width={width}
    height={height}
    viewBox="0 0 20 18"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <desc>Created with Sketch.</desc>
    <defs>
      <polygon
        id="path-10"
        points="9 0 17.660254 5 17.660254 15 9 20 0.339745962 15 0.339745962 5"
      />
      <filter
        x="-60.0%"
        y="-37.5%"
        width="220.0%"
        height="175.0%"
        filterUnits="objectBoundingBox"
        id="filter-30"
      >
        <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="2"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0.843137255   0 0 0 0 0.921568627  0 0 0 0.512341486 0"
          type="matrix"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient
        x1="0%"
        y1="1.72254642e-14%"
        x2="75.0767702%"
        y2="75.0767702%"
        id="linearGradient-5"
      >
        <stop stopColor="#00D7EB" offset="0%" />
        <stop stopColor="#3F4761" offset="100%" />
      </linearGradient>
    </defs>
    <g
      id="Marketplace"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="3.marketplace" transform="translate(-1195.000000, -47.000000)">
        <g id="top">
          <g id="user" transform="translate(1114.000000, 36.000000)">
            <g id="mana" transform="translate(81.000000, 10.000000)">
              <g
                id="Group-13"
                transform="translate(10.000000, 10.000000) scale(-1, 1) rotate(90.000000) translate(-10.000000, -10.000000) translate(1.000000, 0.000000)"
              >
                <g id="Rectangle-2">
                  <mask id="mask-2" fill="white">
                    <use xlinkHref="#path-10" />
                  </mask>
                  <use id="Mask" fill="#515870" xlinkHref="#path-10" />
                  <g
                    id="Group-14"
                    filter="url(#filter-30)"
                    mask="url(#mask-2)"
                    fill="#00D7EB"
                  >
                    <g
                      transform="translate(9.000000, 4.000000)"
                      id="Rectangle-2"
                    >
                      <polygon
                        opacity="0.5"
                        points="0 6 10 0.299999237 10 15 0 15"
                      />
                      <polygon points="0 6 10 11.7999992 10 16 0 16" />
                    </g>
                  </g>
                </g>
                <polygon
                  id="Polygon"
                  fill="url(#linearGradient-5)"
                  points="9 5 13.330127 7.5 13.330127 12.5 9 15 4.66987298 12.5 4.66987298 7.5"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export default Icon
