import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
};

export default function Field({ children }: FieldProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "1000px",
      }}
    >
      <img
        src="/field.png"
        alt="field"
        width="1000"
      />

      <svg
      viewBox="0 0 17.55 8.05"
      preserveAspectRatio="xMidYMid meet"
      style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
  }}
>
        {children}
      </svg>
    </div>
  );
}
