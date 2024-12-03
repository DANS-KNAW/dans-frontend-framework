import { DropDown } from ".";

interface Props {
  children: string | undefined;
  label?: string;
}
export function HelpDropDown({ children, label = "?" }: Props) {
  if (children == null || !children.length) return null;

  return (
    <DropDown label={label} small>
      {children}
    </DropDown>
  );
}
