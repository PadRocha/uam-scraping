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

export interface ueaInfo {
    teacher: string | teacherData;
    group: string;
}

export interface week {
    monday: time | null;
    tuesday: time | null;
    wednesday: time | null;
    thursday: time | null;
    friday: time | null;
}

export type ueaSchedule = ueaInfo & week;

export type ueaData = Omit<ueaSchedule, 'teacher'> & { teacher: teacherData };

export type day = keyof week;