import { Author } from "@/client/types"


interface AuthorSnippetProps{
    author?: Author;
}

export default function AuthorSnppet({author}: AuthorSnippetProps){
    
    return(

        author != undefined ? <p>Recipe Created By <a>{author.firstName}</a> </p>
        : 
    
        <>
            <select>
                <option defaultChecked>Sophia Manicor</option>
                <option>Shane Jung</option>
            </select>
        </>
    )
}