import { Router } from 'express';

import { getSchedule, getUEAS } from '../controllers/SIIUAM';

const DelayedResponse = require('http-delayed-response');

//*------------------------------------------------------------------*/
// * Api Routes
//*------------------------------------------------------------------*/
const router = Router();

//*------------------------------------------------------------------*/
// * Routes
//*------------------------------------------------------------------*/

router.route('/ueas/:USER/:PASS')
    .get((req, res, next) => {
        const delayed = new DelayedResponse(req, res, next);
        delayed.wait();
        const promise = getUEAS(req, res)
        delayed.end(promise);
    });

router.route('/schedule/:USER/:PASS')
    .get(getSchedule);

/*------------------------------------------------------------------*/

export default router;