const dictionary: { [key: string]: string } = {
  title: "display-3 ",
  cardTitle: "h2",
  subtitle: "lead",
  titleId: "h3",
};

interface SimpleTextComponentProps {
  value: string;
  name: string;
}
export default function SimpleTextComponent({
  value,
  name,
}: SimpleTextComponentProps) {
  return <div className={dictionary[name]}>{value}</div>;
}
