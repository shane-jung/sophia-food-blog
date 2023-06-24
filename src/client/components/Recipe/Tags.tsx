import { Link } from "react-router-dom";

import * as emoji from "node-emoji";
import { useQuery } from "react-query";
import axios from "@/client/api/axios";

export default function Tags({ tagIds }: { tagIds?: string[] }) {
  return (
    <div>
      {tagIds?.map((tagId: string, index: number) => (
        <Tag key={index} tagId={tagId} />
      ))}
    </div>
  );
}

function Tag({ tagId }: { tagId: string }) {
  const {data} = useQuery({
    queryKey: ["tag", tagId],
    queryFn: async () => await axios.get(`/tags/id/${tagId}`),
  });


  return (
    <Link
      to={`/category/${data?.data.label.toLowerCase().replace(" ", "-")}`}
      className="btn btn-secondary mx-1 text-capitalize text-light"
    >
      {emoji.emojify(data?.data.label)}
    </Link>
  );
}
