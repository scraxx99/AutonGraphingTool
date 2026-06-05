export type ViewerPoint = {
  x: number;
  y: number;
  t: number;
  heading?: number;
};

export function convertPathPlanner(
  pathData: any
): ViewerPoint[] {
  return pathData.trajectory.samples.map(
    (sample: any) => ({
      x: sample.x,
      y: 8.05 - sample.y,
      t: sample.t,
      heading: sample.heading,
    })
  );
}