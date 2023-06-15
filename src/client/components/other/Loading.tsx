import { CSSProperties } from "react";
import { ClipLoader, DotLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "3em auto",
  height: "5em",
  width: "5em",
};

export default function Loading() {
  return (
    <div className="loading">
      <ClipLoader color={"#0066aa"} cssOverride={override} />
    </div>
  );
}
