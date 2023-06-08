import { Author } from "@/client/types"


interface AuthorSnippetProps{
    author?: Author;
}

export default function AuthorSnippet({author}: AuthorSnippetProps){
    
    return(

        author != undefined ? <p>By <a>{author.firstName}</a> </p>
        : 
    
        <>
            <select>
                <option defaultChecked>Sophia Manicor</option>
                <option>Shane Jung</option>
            </select>
        </>
    )
}