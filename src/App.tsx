import { useEffect, useState } from "react";
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
  const [robotAngle, setRobotAngle] = useState(0);

  // Load JSON path
  useEffect(() => {
    fetch(`/paths/team${team}/${auto}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Could not load team${team}/${auto}.json`
          );
        }

        return response.json();
      })
      .then((data: Point[]) => {
        setPath(data);

        setCurrentPoint(0);
        setTime(0);

        if (data.length > 0) {
          setRobotX(data[0].x);
          setRobotY(data[0].y);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [team, auto]);

  // Advance waypoint index
  useEffect(() => {
    if (path.length === 0) return;
    if (!playing) return;

    const interval = setInterval(() => {
      setCurrentPoint((prev) => {
        if (prev >= path.length - 1) {
          setPlaying(false);
          return prev;
        }

        const next = prev + 1;

        if (path[next]) {
          setTime(path[next].t);
        }

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [path, playing]);

  // Smooth robot movement
  useEffect(() => {
    if (path.length === 0) return;

    const target = path[currentPoint];

    if (!target) return;

    const animation = setInterval(() => {
      setRobotX((prev) => {
        return prev + (target.x - prev) * 0.1;
      });

      setRobotY((prev) => {
        return prev + (target.y - prev) * 0.1;
      });
    }, 16);

    return () => clearInterval(animation);
  }, [currentPoint, path]);
  
  //Rotation stuff

  useEffect(() => {
  if (path.length < 2) return;

  const current = path[currentPoint];

  const next =
    path[Math.min(currentPoint + 1, path.length - 1)];

  const dx = next.x - current.x;
  const dy = next.y - current.y;

  const angle =
    (Math.atan2(dy, dx) * 180) / Math.PI;

  setRobotAngle(angle);
}, [currentPoint, path]);
  if (path.length === 0) {
    return <p>Loading path...</p>;
  }

  const points = path
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  //Adding a path to show completion before future path
  const completedPoints = path
  .slice(0, currentPoint + 1)
  .map((p) => `${p.x},${p.y}`)
  .join(" ");

  return (
    <div>
      <h1>FRC Auton Viewer</h1>

      <p>
        Time: {time.toFixed(1)}s /{" "}
        {path[path.length - 1].t.toFixed(1)}s
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

          if (path.length > 0) {
            setRobotX(path[0].x);
            setRobotY(path[0].y);
          }
        }}
      >
        Reset
      </button>
        //Leader
      <Field>
        <polyline
          points={points}
          stroke="red"
          strokeWidth="6"
          fill="none"
        />
        //Follower 
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