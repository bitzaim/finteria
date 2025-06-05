export type StepListItem = {
  title: string;
  text: string;
  slug: string;
};

export type Props = {
  items: StepListItem[];
  isNumbered?: boolean;
};
