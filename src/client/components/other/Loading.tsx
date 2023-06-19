import { CSSProperties } from "react";
import { ClipLoader as Loader } from "react-spinners";
// import { SyncLoader as Loader } from "react-spinners";


const override: CSSProperties = {
  display: 'block',
  margin: "1em auto",
  height: "2em",
  width: "2em",
};

export default function Loading() {
  return (
    <div className="loading">
      <Loader color={"#006688"} cssOverride={override} speedMultiplier= {.75}/>
    </div>
  );
}
