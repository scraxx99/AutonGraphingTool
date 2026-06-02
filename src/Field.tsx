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
        width="1000"
        height="600"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </svg>
    </div>
  );
}
