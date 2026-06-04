export type ViewerPoint = {
  x: number;
  y: number;
  t: number;
  heading?: number;
};

export function convertPathPlanner(
  pathData: any
): ViewerPoint[] {
  const SCALE = 100;

  const converted = pathData.trajectory.samples.map(
    (sample: any) => ({
      x: sample.x * SCALE,
      y: sample.y * SCALE,
      t: sample.t,
      heading: sample.heading,
    })
  );

  console.log(
    "Bounds:",
    Math.min(...converted.map((p) => p.x)),
    Math.max(...converted.map((p) => p.x)),
    Math.min(...converted.map((p) => p.y)),
    Math.max(...converted.map((p) => p.y))
  );

  console.log(
    "First sample:",
    converted[0]
  );

  console.log(
    "Last sample:",
    converted[converted.length - 1]
  );

  return converted;
}