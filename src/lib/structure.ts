export interface Habit {
    name: string;
    start_time: string;
    start_date: number;
    completed: { [key: string]: boolean };
}