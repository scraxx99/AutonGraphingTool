type RobotProps = {
  x: number;
  y: number;
};

export default function Robot({ x, y }: RobotProps) {
  return (
    <circle
      cx={x}
      cy={y}
      r={12}
      fill="blue"
    />
  );
}