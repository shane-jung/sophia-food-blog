import {useState } from "react";

interface RichTextComponentProps {
  value: string;
  name: string;
}

export default function RichTextComponent({
  value,
  name,
}: RichTextComponentProps) {
  return (
    <div className="my-5">
      {value && <h3 className= "text-center text-capitalize">{name}</h3> }
      <div
        className={"fw-normal text-body-primary lh-lg fs-5 "}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}
