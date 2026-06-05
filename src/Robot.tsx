type RobotProps = {
  x: number;
  y: number;
  angle: number;
};

export default function Robot({ x, y, angle}: RobotProps) {
 return (
  <g
    transform={`translate(${x}, ${y}) rotate(${angle})`}
  >
    <rect
  x={-0.45}
  y={-0.45}
  width={0.9}
  height={0.9}
/>

      <circle
        cx={60}
        cy={0}
        r={4

        }
        fill="white"
      />
  </g>
);
}