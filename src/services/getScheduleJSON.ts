import puppeteer from 'puppeteer';

import { timeParse } from './timeParse';
import { config } from './../config/config';
import { uea, ueaSchedule } from '../models/data';

export async function getScheduleJSON(ueas: uea[], SIIUAM: puppeteer.Page, menu_frame: puppeteer.Frame, info_frame: puppeteer.Frame) {
    let subjects = new Map<string, ueaSchedule[]>();
    let teachers = new Set<string>();

    for await (const uea of ueas) {
        await menu_frame.click('a[href="IEWBC005.oConsulta"]');
        await SIIUAM.waitForTimeout(config.TIMEOUT);
        await info_frame?.type('input[name="CD_UEA.CONTROL.NONMODELED"]', uea.key + '\n');
        await SIIUAM.waitForTimeout(config.TIMEOUT);

        const fieldset = await info_frame?.$('fieldset');
        const tr_array = await fieldset?.$$("tr");
        const schedule = new Array<ueaSchedule>();

        tr_array?.shift();
        if (tr_array)
            for await (const tr of tr_array) {
                const td_array = await tr.$$('td');
                const teacher_handle = await td_array[0]?.getProperty('innerText');
                const teacher = await teacher_handle?.jsonValue() as string;
                const group_handle = await td_array[1]?.getProperty('innerText');
                const group = await group_handle?.jsonValue() as string;
                const monday_handle = await td_array[4]?.getProperty('innerText');
                const monday = await monday_handle?.jsonValue() as string;
                const tuesday_handle = await td_array[5]?.getProperty('innerText');
                const tuesday = await tuesday_handle?.jsonValue() as string;
                const wednesday_handle = await td_array[6]?.getProperty('innerText');
                const wednesday = await wednesday_handle?.jsonValue() as string;
                const thursday_handle = await td_array[7]?.getProperty('innerText');
                const thursday = await thursday_handle?.jsonValue() as string;
                const friday_handle = await td_array[8]?.getProperty('innerText');
                const friday = await friday_handle?.jsonValue() as string;

                schedule.push({
                    teacher,
                    group,
                    monday: timeParse(monday),
                    tuesday: timeParse(tuesday),
                    wednesday: timeParse(wednesday),
                    thursday: timeParse(thursday),
                    friday: timeParse(friday)
                });
            }

        subjects.set(uea.name, schedule);
    }

    teachers = Array.from(subjects).reduce((prev, [subject, schedule]) => {
        schedule.forEach(({ teacher }) => {
            return (teacher as string).length > 1 ? prev.add(teacher as string) : false;
        });
        return prev;
    }, new Set<string>());

    return { subjects, teachers };
}