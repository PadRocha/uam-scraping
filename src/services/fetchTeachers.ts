import puppeteer from 'puppeteer';

import { teacherData, uea } from './../models/data';
import { config } from './../config/config';

export async function fetchTeachers(browser: puppeteer.Browser, teachers: Set<string>) {
    const MISPROFESORES = await browser.newPage();
    const teacherData = new Map<string, teacherData>();

    MISPROFESORES.setDefaultNavigationTimeout(config.TIMEOUT);
    await MISPROFESORES.goto(config.MISPROFESORES, { waitUntil: 'load', timeout: 0 });

    for await (const teacher of teachers) {
        await MISPROFESORES.type('input[name="q"]', teacher + '\n');
        await MISPROFESORES.waitForSelector('a.gs-title');

        const results = await MISPROFESORES.$$('.gsc-webResult.gsc-result');
        if (results)
            do {
                for await (const result of results) {
                    const a = await result?.$('a.gs-title');
                    const text_handle = await a?.getProperty('innerText');
                    const text = await text_handle?.jsonValue() as string;

                    if (a && text.includes('UAM')) {
                        const teacher_path_handle = await a?.getProperty('href');
                        const teacher_path = await teacher_path_handle?.jsonValue() as string;
                        const DATA = await browser.newPage();

                        await DATA.goto(teacher_path, { waitUntil: 'load', timeout: 0 });
                        DATA.setDefaultNavigationTimeout(15_000_000);

                        const quality_element = await DATA.$('.quality .grade');
                        const quality_handle = await quality_element?.getProperty('innerText');
                        const quality_text = await quality_handle?.jsonValue() as string;
                        const quality = Number(quality_text);
                        const takeAgain_element = await DATA.$('.takeAgain .grade');
                        const takeAgain_handle = await takeAgain_element?.getProperty('innerText');
                        const takeAgain_text = await takeAgain_handle?.jsonValue() as string;
                        const takeAgain = Number(takeAgain_text?.slice(0, -1));
                        const difficulty_element = await DATA.$('.difficulty .grade');
                        const difficulty_handle = await difficulty_element?.getProperty('innerText');
                        const difficulty_text = await difficulty_handle?.jsonValue() as string;
                        const difficulty = Number(difficulty_text);
                        const students_element = await DATA.$('.rating-count');
                        const students_handle = await students_element?.getProperty('innerText');
                        const students_text = await students_handle?.jsonValue() as string;
                        const students = Number(students_text.trim().split(/\s/).shift());

                        teacherData.set(teacher, {
                            name: teacher,
                            quality,
                            takeAgain,
                            difficulty,
                            students
                        });
                        await DATA?.close();
                        break;
                    }
                }
            } while (teacherData.size < 1);
    }

    return teacherData;
}