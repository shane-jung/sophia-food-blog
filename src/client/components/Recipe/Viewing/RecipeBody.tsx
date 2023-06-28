import Container from "react-bootstrap/Container";
import SimpleTextComponent from "./SimpleTextComponent";
import RichTextComponent from "./RichTextComponent";
import ImageUpload from "../Form/ImageUpload";
import Image from "react-bootstrap/Image";

export default function RecipeBody({ body }: any) {
    return (
      <Container id="recipe">
        {body?.map((section: any, index: number) => {
          switch (section.type) {
            case "simple":
              return (
                <SimpleTextComponent
                  key={index}
                  value={section.value}
                  name={section.name}
                />
              );
            case "rich":
              return (
                <RichTextComponent
                  key={index}
                  value={section.value}
                  name={section.name}
                />
              );
            case "image":
              return (
                <ImageUpload key={index} imageUrl={section.value} index={index} />
              );
            case "double-image":
              return (
                <div className="double-image" key={index}>
                  <Image src={section.value} />
                  <Image src={section.value} />
                </div>
              );
          }
        })}
      </Container>
    );
  }