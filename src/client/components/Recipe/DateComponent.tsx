import { _viewMode } from "@/client/enums";
import useViewMode from "@/client/utils/useViewMode";

interface DateComponentProps {
  dateCreated : string, 
  dateEdited : string
}


export default function DateComponent( props : DateComponentProps ) {
    const dateOptions : Intl.DateTimeFormatOptions= {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        } 
    const formattedDateEdited = new Date(props.dateEdited).toLocaleDateString('en-gb', dateOptions);
    const formattedDateCreated = new Date(props.dateCreated).toLocaleDateString('en-gb', dateOptions);
    const { viewMode } = useViewMode();
    return(
        viewMode != _viewMode.CREATING && <div>
            <span className = "recipe-dates">Created {formattedDateCreated} - Edited {formattedDateEdited} </span>   
        </div>
       
    )
}