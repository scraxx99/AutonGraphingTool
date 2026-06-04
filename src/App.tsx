import { useEffect, useState } from "react";
import Field from "./Field";
import Robot from "./Robot";
import {
  convertPathPlanner,
} from "./converters/pathplanner";

type Point = {
  x: number;
  y: number;
  t: number;
};

function App() {
  const [path, setPath] = useState<Point[]>([]);

  const [team, setTeam] = useState("254");
  const [auto, setAuto] = useState("left");

  const [playing, setPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load JSON path
  useEffect(() => {
    fetch("/pathplanner/citrus.path")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Could not load team${team}/${auto}.json`
          );
        }

        return response.json();
      })
      .then((data) => {
        const converted =
        convertPathPlanner(data);

        console.log(converted);

        setPath(converted);
        setElapsedTime(0);
        setPlaying(true);
})
  }, [team, auto]);

  // Replay clock
  useEffect(() => {
    if (!playing) return;
    if (path.length < 2) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const maxTime = path[path.length - 1].t;

        const next = prev + 0.05;

        if (next >= maxTime) {
          setPlaying(false);
          return maxTime;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playing, path]);

  if (path.length === 0) {
    return <p>Loading path...</p>;
  }

  // Find current segment
  let segmentIndex = path.length - 2;

  for (let i = 0; i < path.length - 1; i++) {
    if (
      elapsedTime >= path[i].t &&
      elapsedTime <= path[i + 1].t
    ) {
      segmentIndex = i;
      break;
    }
  }

  const start = path[segmentIndex];
  const end =
    path[Math.min(segmentIndex + 1, path.length - 1)];

  const segmentDuration = end.t - start.t;

  const progress =
    segmentDuration === 0
      ? 0
      : (elapsedTime - start.t) / segmentDuration;

  // Robot position
  const robotX =
    start.x +
    (end.x - start.x) * progress;

  const robotY =
    start.y +
    (end.y - start.y) * progress;

  // Robot rotation
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const robotAngle =
    (Math.atan2(dy, dx) * 180) / Math.PI;

  // Full path
  const points = path
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  // Completed path
  const completedPoints = path
    .filter((p) => p.t <= elapsedTime)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <div>
      <h1>FRC Auton Viewer</h1>

      <p>
        Time: {elapsedTime.toFixed(1)}s /{" "}
        {path[path.length - 1].t.toFixed(1)}s
      </p>

      <select
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      >
        <option value="254">254</option>
        <option value="118">118</option>
      </select>

      <select
        value={auto}
        onChange={(e) => setAuto(e.target.value)}
      >
        <option value="left">Left Auto</option>
        <option value="center">Center Auto</option>
        <option value="right">Right Auto</option>
      </select>

      <button onClick={() => setPlaying(true)}>
        Play
      </button>

      <button onClick={() => setPlaying(false)}>
        Pause
      </button>

      <button
        onClick={() => {
          setPlaying(false);
          setElapsedTime(0);
        }}
      >
        Reset
      </button>

      <Field>
        {/* Remaining path */}
        <polyline
          points={points}
          stroke="red"
          strokeWidth="6"
          fill="none"
        />

        {/* Completed path */}
        <polyline
          points={completedPoints}
          stroke="lime"
          strokeWidth="8"
          fill="none"
        />

        {/* Start marker */}
        <circle
          cx={path[0].x}
          cy={path[0].y}
          r={8}
          fill="green"
        />

        {/* End marker */}
        <circle
          cx={path[path.length - 1].x}
          cy={path[path.length - 1].y}
          r={8}
          fill="red"
        />

        {/* Waypoints */}
        {path.map((p, index) => (
          <circle
            key={index}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="yellow"
          />
        ))}

        <Robot
          x={robotX}
          y={robotY}
          angle={robotAngle}
        />
      </Field>
    </div>
  );
}

export default App;