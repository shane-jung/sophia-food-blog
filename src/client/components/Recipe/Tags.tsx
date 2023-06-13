import Select from 'react-select';
import { useEffect, useMemo, useState } from 'react';
import CreatableSelect, {useCreatable} from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipe } from '@/client/slices/recipe';
import axios from '../../api/axios';

export default function Tags(){
    const viewMode = useSelector((state:any) => state.user.viewMode);
    const [selected, setSelected] = useState<any>([]);
    const [options, setOptions] = useState<any>([]);
    const recipeId = useSelector((state:any) => state.recipe._id);
    const tags = useSelector((state:any) => state.recipe.tags);
    const dispatch = useDispatch();

    useMemo(async () => {
        const response = await axios.get('/recipes/tags');
        const options = response.data.map((tag:any) => { 
            return {value: tag.value, label: tag.value, _id: tag._id}
        })
        setOptions(options);
    }, [recipeId])

    useEffect(()=>{
        if(!tags[0]?._id) return;
        const tagIds = tags.map((tag:any) => tag._id);
        setSelected(options.filter((tag:any) => tagIds.includes(tag._id)));
    }, [tags, options])

    async function createOption(option:string){
        try{
            const response = await axios.post('/recipes/tags/create', {tag: option});
            options.push({value: option, label: option,_id: response.data});
        }  catch(err){
            console.log(err);
        }   
    }

    function onChange(e:any){
        dispatch(setRecipe({tags: [...e]}));
    }

    return (
         viewMode != "VIEWING" ? 
            <div className ="tags-select-container">
                <label>Tags</label>
                <CreatableSelect 
                    name='tags'
                    closeMenuOnSelect={false} 
                    isClearable
                    isMulti
                    onChange={onChange}
                    options = {options} 
                    onCreateOption={createOption} 
                    value={selected}
                />
            </div>
            :
            <div className='recipe-tags'>
                {selected.map((tag:any) => {
                    return <div key={tag._id} ><a 
                                
                                className="recipe-tag" 
                                href= {`/categories/${tag.label.toLowerCase().replace(" ", '-')}`} 
                            >{tag.value}</a></div>
                })} 
            </div> 
    );
}