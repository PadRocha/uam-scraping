import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

import { uea, teacherData, ueaData, time, day } from '../models/data';
import { getScheduleJSON } from '../services/getScheduleJSON';
import { fetchTeachers, getUEASJSON, loginSIIUAM } from '../services';

export async function getUEAS({ query, params, body }: Request, res: Response) {
    const { USER, PASS } = params;

    if (!USER || !PASS)
        return res.status(400).send({ message: 'Client has not sent params' });

    const browser = await puppeteer.launch({ headless: false });
    try {
        const { info_frame } = await loginSIIUAM(USER, PASS, browser);

        if (info_frame) {
            const ueas = await getUEASJSON(info_frame);

            if (ueas) {
                res.status(200).send({ ueas });
            } else {
                res.status(403).send({ message: 'Something failed in the scraping process - Lv 2' });
            }
        } else {
            res.status(403).send({ message: 'Something failed in the scraping process - Lv 1' });
        }

        await browser.close()
    } catch (error) {
        res.status(409).send({ message: 'Scraping process crashed' });
    } finally {
        await browser.close();
    }
}

export async function getSchedule({ query, params, body }: Request, res: Response) {
    const { USER, PASS } = params;

    if (!USER || !PASS)
        return res.status(400).send({ message: 'Client has not sent params' });

    const browser = await puppeteer.launch({ headless: false });
    try {
        const { menu_frame, info_frame, SIIUAM } = await loginSIIUAM(USER, PASS, browser);

        if (info_frame && menu_frame) {
            const ueas = !body?.ueas
                ? await getUEASJSON(info_frame)
                : body.ueas as uea[];

            if (ueas) {
                let { subjects, teachers } = await getScheduleJSON(ueas, SIIUAM, menu_frame, info_frame);

                if (teachers.size > 1) {
                    const teacherData = await fetchTeachers(browser, teachers);

                    const data = Array.from(subjects).reduce((prev, [subject, schedule]) => {
                        return prev.set(subject, schedule.map(uea => {
                            uea.teacher = teacherData.has(uea.teacher as string)
                                ? teacherData.get(uea.teacher as string) as teacherData
                                : {
                                    name: '',
                                    quality: 0,
                                    takeAgain: 0,
                                    difficulty: 0,
                                    students: 0
                                };
                            return uea as ueaData;
                        }).sort(({ teacher: a }, { teacher: b }) => {
                            const sort_quality = (a.quality < b.quality) ? -1 : ((a.quality > b.quality) ? 1 : 0);
                            const sort_students = (a.students < b.students) ? -1 : ((a.students > b.students) ? 1 : 0);
                            return sort_quality || sort_students;
                        }).reverse());
                    }, new Map<string, ueaData[]>());

                    const all_combinations = new Map<string, Map<string, ueaData>>();
                    const weekend = new Array<day>('monday', 'tuesday', 'wednesday', 'thursday', 'friday');

                    for (const [subject, schedules_root] of data) {
                        const filteres_subjects = Array.from(data.keys())
                            .filter(s => s !== subject)
                            .sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0));

                        for (const schedule_data of schedules_root) {
                            const compatible_schedules = new Map<string, ueaData>();
                            if (!schedule_data.teacher.name)
                                break;

                            compatible_schedules.set(subject, schedule_data);
                            filteres_subjects.forEach((subject_iteration, i) => {
                                const schedules_iteration = data.get(subject_iteration) as ueaData[];

                                for (const schedule_curr of schedules_iteration) {

                                    let bool_val = true;
                                    for (const [, uea] of compatible_schedules) {
                                        for (const day of weekend) {
                                            const uea_day = uea[day] as time;
                                            const curr_day = schedule_curr[day] as time;

                                            if (uea_day && curr_day) {
                                                if (
                                                    uea_day.starts === curr_day.starts ||
                                                    uea_day.ends === curr_day.ends ||
                                                    (curr_day.starts > uea_day.starts && curr_day.starts < uea_day.ends) ||
                                                    (curr_day.ends > uea_day.starts && curr_day.ends < uea_day.ends) ||
                                                    (uea_day.starts > curr_day.starts && uea_day.starts < curr_day.ends) ||
                                                    (uea_day.ends > curr_day.starts && uea_day.ends < curr_day.ends)
                                                ) {
                                                    bool_val = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    if (!!bool_val && !!schedule_curr.teacher.name) {
                                        compatible_schedules.set(subject_iteration, schedule_curr);
                                        break;
                                    }
                                }
                            });

                            if (compatible_schedules.size == data.size) {
                                const sorted_compatible = Array.from(compatible_schedules)
                                    .sort(([a], [b]) => (a < b) ? -1 : ((a > b) ? 1 : 0));
                                const SCHEDULECODE = sorted_compatible.reduce((prev, [subject_code, schedule_code]) => {
                                    prev += schedule_code.group;
                                    prev += subject_code.substring(0, 3).toUpperCase();
                                    prev += subject_code.slice(-3).toUpperCase();
                                    prev += schedule_code.teacher.name.substring(0, 3).toUpperCase();
                                    prev += schedule_code.teacher.name.slice(-3).toUpperCase();
                                    return prev;
                                }, '').padEnd(data.size * 18, '0');

                                all_combinations.set(SCHEDULECODE, new Map(sorted_compatible));
                            }
                        }
                    }

                    let sorted_iterations = Array.from(all_combinations).sort(([, schedule_a], [, schedule_b]) => {
                        const a = Array.from(schedule_a).reduce((prev, [, schedule_percent]) => {
                            return prev += schedule_percent.teacher.quality;
                        }, 0) / schedule_a.size;
                        const b = Array.from(schedule_b).reduce((prev, [, schedule_percent]) => {
                            return prev += schedule_percent.teacher.quality;
                        }, 0) / schedule_b.size;
                        return a - b;
                    }).reverse();

                    if (body?.queryTeachers instanceof Array) {
                        sorted_iterations = sorted_iterations.filter(([, schedule_filter]) => {
                            return !Array.from(schedule_filter.entries()).every(([, uea_filter]) => {
                                return body.queryTeachers.includes(uea_filter.teacher.name);
                            });
                        });
                    }


                    res.status(200).send(sorted_iterations
                        .slice(body?.skip || 0, body?.limit || -1)
                        .map(([SCHEDULECODE, schedule]) => {
                            return {
                                SCHEDULECODE,
                                schedule: Array.from(schedule.entries())
                            }
                        }));
                } else {
                    res.status(403).send({ message: 'Something failed in the scraping process - Lv 3' });
                }
            } else {
                res.status(403).send({ message: 'Something failed in the scraping process - Lv 2' });
            }
        } else {
            res.status(403).send({ message: 'Something failed in the scraping process - Lv 1' });
        }
    } catch (error) {
        res.status(409).send({ message: 'Scraping process crashed' });
    } finally {
        await browser.close();
    }
}