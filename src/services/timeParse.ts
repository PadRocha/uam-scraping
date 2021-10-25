import { time } from '../models/data';

export function timeParse(time: string): time | null {
    const [starts, ends] = time.trim().split(' - ');

    return time.trim().length > 1
        ? {
            starts: Number(starts.replace(':', '.')),
            ends: Number(ends.replace(':', '.'))
        }
        : null;
}