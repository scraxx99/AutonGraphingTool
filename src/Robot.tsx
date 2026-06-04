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
      y={-23}
      width={75}
      height={50
      }
      fill="blue"
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