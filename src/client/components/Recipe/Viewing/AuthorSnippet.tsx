import { Author } from "@/client/types";
import { Link } from "react-router-dom";

interface AuthorSnippetProps {
  author?: Author;
}

export default function AuthorSnippet({ author }: AuthorSnippetProps) {
  return (
    <div>
      By <Link to="/" className="link-primary text-decoration-none">Sophia</Link>
    </div>
  ) 
}
