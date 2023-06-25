import { Link } from "react-router-dom";

import * as emoji from "node-emoji";
import { useQuery } from "react-query";
import axios from "@/client/api/axios";

export default function Tags({ tagIds, category}: { tagIds?: string[], category:string }) {
  console.log(tagIds);
  return (
    <div>
      <h4>{category}</h4>
      {tagIds?.map((tagId: string, index: number) => (
        <Tag key={index} tagId={tagId} />
      ))}
    </div>
  );
}

function Tag({ tagId }: { tagId: string }) {
  const tag = useQuery({
    queryKey: ["tag", tagId],
    queryFn: async () => await axios.get(`/tags/id/${tagId}`),
  }).data;


  return (
    <Link
      to={`/category/${tag?.data?.label?.toLowerCase().replace(" ", "-")}`}
      className="btn btn-secondary mx-1 text-capitalize text-light"
    >
      {emoji.emojify(tag?.data?.label)}
    </Link>
  );
}
