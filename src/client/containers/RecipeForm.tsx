
export default function RecipeForm(){

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append('dateEdited', new Date().toISOString());
        !data.get('dateCreated') && data.append('dateCreated', new Date().toISOString());
        fetch('/api/recipes/create', {
            method: 'POST',
            body: data, 
        }).then(() => {
            window.location.href = '/';

        });
      }
    return (
        <form onSubmit= {handleSubmit} action='/api/recipes/create' method='POST'  encType="multipart/form-data">
            <h1>New Recipe</h1>
            <input type='text' name='title' required placeholder="Recipe Title" />
            <input type="text" name='titleID' placeholder="Title ID (A short Identifier for the recipe, used in the URL. Example: mac-and-cheese, or 'mashed-potato-paprikish)" required/>
            <textarea name='description' placeholder = "Recipe Description" required/>
            <textarea name='instructions' placeholder = "Recipe Instructions" required/>

            <button type='submit'>Submit</button>
        </form>
    );
}