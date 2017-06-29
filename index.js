/*
  This application monitors SEC for 10-Q Reports.  Once these reports
    are received, they are evaluated by a custom algorithm.  If the 
    algorithm verifies that they meet its criteria, an alert is sent
    to the email address in the config file.  

  Files:
  -

  Author:
  - Joe Edwards
  - joe@joedevelops.com
*/
'use strict';

/*
  DEPENDENCIES=======================================================
*/
var forever = require('forever-monitor');
var logger = require('winston');


/*
  LOGGING ===========================================================
*/
logger.configure(
  {
    transports: [
      new (logger.transports.File) ({
        name: 'cerebra-error',
        filename: './logs/error.log',
        level: 'error',
        timestamp: true,
      }),
      new (logger.transports.File) ({
        name: 'cerebra-info',
        filename: './logs/info.log',
        level: 'info',
        timestamp: true,
      }),
    ]
  }
);


/*
  LAUNCH MODULES ====================================================
*/

/*
  Filings Monitor:
    This program actively monitors the SEC for new 10-Q reports.
*/
var filingsMonitor = new (forever.Monitor)('./modules/filingsMonitor.js');
filingsMonitor.start();

/*
  LOG MODULE FAILURE & RESTART ======================================
*/

filingsMonitor.on('restart', ()=> {
  logger.log('error', 'Filings Monitor restarted');
});

/*
  LOG LAUNCH ========================================================
*/
logger.log('info', 'SECAlert launched.');