import { Router } from 'express';

import { getSchedule, getUEAS } from '../controllers/SIIUAM'

//*------------------------------------------------------------------*/
// * Api Routes
//*------------------------------------------------------------------*/
const router = Router();

//*------------------------------------------------------------------*/
// * Routes
//*------------------------------------------------------------------*/

router.route('/ueas/:USER/:PASS')
    .get(getUEAS);

router.route('/schedule/:USER/:PASS')
    .get(getSchedule);

/*------------------------------------------------------------------*/

export default router;