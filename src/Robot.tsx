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
      x={-15}
      y={-10}
      width={30}
      height={20}
      fill="blue"
    />

    <circle
      cx={12}
      cy={0}
      r={4}
      fill="white"
    />
  </g>
);
}