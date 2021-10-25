import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

import { config } from '../config/config';
import { uea, ueaSchedule, teacherData } from '../models/data';
import { getScheduleJSON } from '../services/getScheduleJSON';
import { fetchTeachers, getUEASJSON, loginSIIUAM } from '../services';
import { timeParse } from '../services/timeParse';

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
                res.status(403).send({ message: 'Something failed in the scraping process' });
            }
        } else {
            res.status(403).send({ message: 'Something failed in the scraping process' });
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

                    subjects = Array.from(subjects).reduce((prev, [subject, schedule]) => {
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
                            return uea as Omit<ueaSchedule, 'teacher'> & { teacher: teacherData }
                        }).sort(({ teacher: a }, { teacher: b }) => {
                            const sort_quality = (a.quality < b.quality) ? -1 : ((a.quality > b.quality) ? 1 : 0);
                            const sort_students = (a.students < b.students) ? -1 : ((a.students > b.students) ? 1 : 0);
                            return sort_quality || sort_students;
                        }).reverse());
                    }, new Map<string, ueaSchedule[]>());

                    res.status(200).send({
                        subjects: Array.from(subjects.entries()).map(([k]) => k),
                        schedules: Array.from(subjects.entries())
                    });
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