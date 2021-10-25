import puppeteer from 'puppeteer';

import { uea } from '../models/data';

export async function getUEASJSON(info_frame: puppeteer.Frame) {
    const ueas = new Array<uea>();
    const ifrmBol = await info_frame?.$('iframe#ifrm_bol');
    const ifrm_bol = await ifrmBol?.contentFrame();
    const _frame = await ifrm_bol?.$('iframe');
    const frame = await _frame?.contentFrame();
    const uea_disponible = await frame?.$$('.celda.uea_disponible');

    if (uea_disponible) {
        do {
            for await (const uea of uea_disponible) {
                const id = await uea.getProperty('id');
                const key = await id?.jsonValue() as string;
                const _name = await uea?.$('.nombre');
                const name = await _name?.evaluate(e => e.textContent) as string;

                ueas.push({ key, name });
            }
        } while (ueas.length < 1);

        return ueas;
    } else {
        return null;
    }
}