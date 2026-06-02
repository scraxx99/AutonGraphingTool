import { useEffect, useState } from "react";
import Field from "./Field";
import Robot from "./Robot";

type Point = {
  x: number;
  y: number;
};

function App() {
  const [path, setPath] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [team, setTeam] = useState("254");
  const [auto, setAuto] = useState("left");
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

    const interval = setInterval(() => {
      setCurrentPoint((prev) => {
        if (prev >= path.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [path.length]);

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