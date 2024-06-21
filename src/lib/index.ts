import type { Habit } from "./structure";

export function convertTo24Hour(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
    }

    return `${hours}:${minutes}`;
}

export function sortHabitsByStartTime(habits: Habit[]): Habit[] {
    return habits.sort((a, b) => {
        const timeA = convertTo24Hour(a.start_time);
        const timeB = convertTo24Hour(b.start_time);

        return timeA.localeCompare(timeB);
    });
}

export function convertToMilliseconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;
    return hoursInMilliseconds + minutesInMilliseconds;
}


export function getStartOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
}

export function calculateMilliSecondes(habit: Habit, index: number): number {
    const startOfToday = getStartOfToday();
    const startTimeInMilliseconds = convertToMilliseconds(convertTo24Hour(habit.start_time));
    return startOfToday + startTimeInMilliseconds + (index * 86400000);
}

export function getCurrentTime() {
    return new Date().getTime();
}