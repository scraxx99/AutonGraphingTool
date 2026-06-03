import { use, useEffect, useState } from "react";
import Field from "./Field";
import Robot from "./Robot";

type Point = {
  x: number;
  y: number;
  t: number;
};
  
function App() {
  const [path, setPath] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [team, setTeam] = useState("254");
  const [auto, setAuto] = useState("left");
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [robotX, setRobotX] = useState(0);
  const [robotY, setRobotY] = useState(0);
  // Load path from JSON
useEffect(() => {
  console.log(
    "Loading:",
    `/paths/team${team}/${auto}.json`
  );

  fetch(`/paths/team${team}/${auto}.json`)
    .then((response) => {
      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Could not load team${team}/${auto}.json`
        );
      }

      return response.json();
    })
    .then((data) => {
      setPath(data);
      setCurrentPoint(0);
    })
    .catch((error) => {
      console.error("LOAD ERROR:", error);
    });
}, [team, auto]);
  // Animate robot
  useEffect(() => {
    if (path.length === 0) return;
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentPoint((prev) => {
        if (prev >= path.length - 1) {
        setPlaying(false);
        return prev;
        }
        return prev + 1;
      });
      setCurrentPoint((prev) => {
  if (prev >= path.length - 1) {
    setPlaying(false);
    return prev;
  }

  const next = prev + 1;

  setTime(path[next].t);

  return next;
});
    }, 300);

    return () => clearInterval(interval);
  }, [path.length, playing]);

  // Wait until JSON is loaded
  if (path.length === 0) {
    return <p>Loading path...</p>;
  }

  const points = path
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <div>
      <h1>FRC Auton Viewer</h1>
        <p>
  Time: {time.toFixed(1)}s / {path[path.length - 1].t.toFixed(1)}s
</p>
      <p>Path Length: {path.length}</p>
      <p>Current Point: {currentPoint}</p>
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
    setCurrentPoint(0);
    setTime(0);
  }}
>
  Reset
</button>
      <Field>
        <polyline
          points={points}
          stroke="red"
          strokeWidth="6"
          fill="none"
        />

        {/* Debug waypoint markers */}
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
          x={path[currentPoint].x}
          y={path[currentPoint].y}
        />
      </Field>
    </div>
  );
}

export default App;