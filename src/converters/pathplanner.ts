export type ViewerPoint = {
  x: number;
  y: number;
  t: number;
  heading?: number;
};

export function convertPathPlanner(
  pathData: any
): ViewerPoint[] {
  const SCALE = 60;

  return pathData.trajectory.samples.map(
    (sample: any) => ({
      x: sample.x * SCALE,
      y: sample.y * SCALE,
      t: sample.t,
      heading: sample.heading,
    })
  );
}