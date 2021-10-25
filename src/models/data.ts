export interface uea {
    key: string;
    name: string;
}

export interface teacherData {
    name: string;
    quality: number;
    takeAgain: number;
    difficulty: number;
    students: number;
}

export interface time {
    starts: number;
    ends: number;
}

export interface ueaSchedule {
    teacher: string | teacherData;
    group: string;
    monday: time | null;
    tuesday: time | null;
    wednesday: time | null;
    thursday: time | null;
    friday: time | null;
}