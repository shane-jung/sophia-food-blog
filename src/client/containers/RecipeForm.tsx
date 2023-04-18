
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
            <label>
                <span> Recipe Title </span>
                <input type='text' name='title' required/>
            </label>

            <label>
                <span>Recipe ID (A short Identifier for the recipe, used in the URL. Example: mac-and-cheese, or 'mashed-potato-paprikish'). </span> 
                <input type="text" name='titleID' required/>
            </label>

            <label>
                Recipe Description
                <textarea name='description' required/>
            </label>

            <label>
                Recipe Instructions 
                <textarea name='instructions' required/>
            </label>

            <button type='submit'>Submit</button>
        </form>
    );
}