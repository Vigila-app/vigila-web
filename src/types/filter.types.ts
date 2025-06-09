export type FilterI = {
    label: string;
    placeholder?: string;
    onChange?: (filterValue: string) => void;
    value?: string;
};