export type CheckListItem = {
  title: string;
  text: string;
};

export type Props = {
  items: CheckListItem[];
  titleTag?: string;
};
