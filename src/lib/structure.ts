export interface Habit {
    id: string;
    start_date: number;
    description: string;
    checked: { [index: number]: boolean };
    habits: Habit[]
}