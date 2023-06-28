import ImageUpload from "./ImageUpload";
import RichTextInput from "./RichTextInput";

export default function RecipeBodyElement({
    element,
    index,
    setBody,
  }: {
    element: any;
    index: number;
    setBody: any;
  }) {
    switch (element.type) {
      case "rich":
        return (
          <RichTextInput
            key={index}
            name={element.name}
            value={element.value}
            label={element.name}
            setBody={setBody}
            index={index}
          />
        );
      case "image":
        return <ImageUpload imageUrl={element.value} setBody={setBody} index={index}/>;
      case "double-image":
        return (
          <div className="d-flex double-image">
            <ImageUpload imageUrl= {element.value} setBody={setBody} index = {index} />
            <ImageUpload imageUrl= {element.value} setBody = {setBody} index = {index} />
          </div>
        );
  
      default:
        return <></>;
    }
  }
  
  