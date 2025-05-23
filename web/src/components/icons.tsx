import * as React from "react";

import { IconSvgProps } from "@/types/comman";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    width={size || height}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <filter
      id="b"
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      height={54}
      width={48}
      x={0}
      y={-3}
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={-3} />
      <feGaussianBlur stdDeviation={1.5} />
      <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
      <feBlend in2="shape" result="effect1_innerShadow_3051_47005" />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feOffset dy={3} />
      <feGaussianBlur stdDeviation={1.5} />
      <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
      <feBlend
        in2="effect1_innerShadow_3051_47005"
        result="effect2_innerShadow_3051_47005"
      />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feMorphology
        in="SourceAlpha"
        radius={1}
        result="effect3_innerShadow_3051_47005"
      />
      <feOffset />
      <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
      <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.24 0" />
      <feBlend
        in2="effect2_innerShadow_3051_47005"
        result="effect3_innerShadow_3051_47005"
      />
    </filter>
    <filter
      id="e"
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      height={42}
      width={30}
      x={9}
      y={5.25}
    >
      <feFlood floodOpacity={0} result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feMorphology
        in="SourceAlpha"
        radius={1.5}
        result="effect1_dropShadow_3051_47005"
      />
      <feOffset dy={2.25} />
      <feGaussianBlur stdDeviation={2.25} />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0" />
      <feBlend
        in2="BackgroundImageFix"
        result="effect1_dropShadow_3051_47005"
      />
      <feBlend
        in="SourceGraphic"
        in2="effect1_dropShadow_3051_47005"
        result="shape"
      />
    </filter>
    <linearGradient
      id="d"
      gradientUnits="userSpaceOnUse"
      x1={24}
      x2={26}
      y1={0.000001}
      y2={48}
    >
      <stop offset={0} stopColor="#fff" stopOpacity={0} />
      <stop offset={1} stopColor="#fff" stopOpacity={0.12} />
    </linearGradient>
    <linearGradient id="a">
      <stop offset={0} stopColor="#fff" stopOpacity={0.8} />
      <stop offset={1} stopColor="#fff" stopOpacity={0.5} />
    </linearGradient>
    <linearGradient
      id="f"
      gradientUnits="userSpaceOnUse"
      x1={16.0492}
      x2={16.0492}
      xlinkHref="#a"
      y1={20.4004}
      y2={27.6004}
    />
    <linearGradient
      id="g"
      gradientUnits="userSpaceOnUse"
      x1={39.1508}
      x2={39.1508}
      xlinkHref="#a"
      y1={27.5996}
      y2={34.7996}
    />
    <linearGradient
      id="h"
      gradientUnits="userSpaceOnUse"
      x1={23.9984}
      x2={23.9984}
      xlinkHref="#a"
      y1={13.2002}
      y2={27.6002}
    />
    <linearGradient
      id="i"
      gradientUnits="userSpaceOnUse"
      x1={23.9996}
      x2={23.9996}
      xlinkHref="#a"
      y1={34.7998}
      y2={20.3998}
    />
    <linearGradient
      id="j"
      gradientUnits="userSpaceOnUse"
      x1={20.3992}
      x2={20.3992}
      xlinkHref="#a"
      y1={6}
      y2={20.4}
    />
    <linearGradient
      id="k"
      gradientUnits="userSpaceOnUse"
      x1={27.6008}
      x2={27.6008}
      xlinkHref="#a"
      y1={42}
      y2={27.6}
    />
    <linearGradient
      id="l"
      gradientUnits="userSpaceOnUse"
      x1={24}
      x2={24}
      y1={0}
      y2={48}
    >
      <stop offset={0} stopColor="#fff" stopOpacity={0.12} />
      <stop offset={1} stopColor="#fff" stopOpacity={0} />
    </linearGradient>
    <clipPath id="c">
      <rect height={48} rx={12} width={48} />
    </clipPath>
    <g filter="url(#b)">
      <g clipPath="url(#c)">
        <rect fill="#099250" height={48} rx={12} width={48} />
        <path d="M0 0h48v48H0z" fill="url(#d)" />
        <g filter="url(#e)">
          <path d="M12.45 20.4h7.2v7.2h-7.2z" fill="url(#f)" opacity={0.8} />
          <path
            d="M35.55 27.6h7.2v7.2h-7.2z"
            fill="url(#g)"
            opacity={0.8}
            transform="rotate(180 35.55 27.6)"
          />
          <path
            d="M19.648 20.4l8.7-7.2v7.2l-8.7 7.2z"
            fill="url(#h)"
            opacity={0.2}
          />
          <path
            d="M28.35 27.6l-8.7 7.2v-7.2l8.7-7.2z"
            fill="url(#i)"
            opacity={0.4}
          />
          <path
            d="M12.45 20.4L28.35 6v7.2l-8.7 7.2z"
            fill="url(#j)"
            opacity={0.6}
          />
          <path
            d="M35.55 27.6L19.65 42v-7.2l8.7-7.2z"
            fill="url(#k)"
            opacity={0.7}
          />
        </g>
      </g>
      <rect
        height={46}
        rx={11}
        stroke="url(#l)"
        strokeWidth={2}
        width={46}
        x={1}
        y={1}
      />
    </g>
  </svg>
);

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);
