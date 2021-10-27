import puppeteer from 'puppeteer';

import { config } from '../config/config';

export async function loginSIIUAM(USER: string, PASS: string, browser: puppeteer.Browser) {
    const SIIUAM = await browser.newPage();

    SIIUAM.setDefaultNavigationTimeout(config.NAVIGATION);
    await SIIUAM.goto(config.SIIUAM, { waitUntil: 'load', timeout: 0 });

    const bodyFrame = await SIIUAM.$('frame#bodyFrame');
    const body_frame = await bodyFrame?.contentFrame();
    const controlFrame = await body_frame?.$('frame#controlFrame');
    const control_frame = await controlFrame?.contentFrame();
    const menuFrame = await control_frame?.$('frame#menuFrame');
    const menu_frame = await menuFrame?.contentFrame();
    const infoFrame = await body_frame?.$('frame#infoFrame');
    const info_frame = await infoFrame?.contentFrame();

    if (menu_frame) {
        await menu_frame.type('input[name="NOMBRE.IDENTIFICACION.NONMODELED"]', USER);
        await menu_frame.type('input[name="COMPLEMENTO.IDENTIFICACION.NONMODELED"]', PASS);
        await menu_frame.click('input[name="GO.IDENTIFICACION.NONMODELED"]');
        await SIIUAM.waitForTimeout(config.TIMEOUT);
    }

    return {
        SIIUAM,
        menu_frame,
        info_frame
    };
}