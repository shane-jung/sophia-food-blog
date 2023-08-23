import { useState } from "react";

interface RichTextComponentProps {
  value: string;
  name: string;
}

export default function RichTextComponent({
  value,
  name,
}: RichTextComponentProps) {
  return (
    <div className="mb-4  ">
      {value && <h3 className="text-center text-capitalize mb-1">{name}</h3>}
      <div
        className={"fw-normal text-body-primary lh-lg fs-6 "}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}
