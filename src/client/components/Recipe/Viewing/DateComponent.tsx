interface DateComponentProps {
  dateCreated: string;
  dateEdited: string;
}

export default function DateComponent(props: DateComponentProps) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDateEdited = new Date(props.dateEdited).toLocaleDateString(
    "en-US",
    dateOptions
  );
  const formattedDateCreated = new Date(props.dateCreated).toLocaleDateString(
    "en-US",
    dateOptions
  );
  return <span className="text-center center">{formattedDateCreated}</span>;
}
