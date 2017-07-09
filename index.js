/*
  This application monitors SEC for 10-Q Reports.  Once these reports
    are received, they are evaluated by a custom algorithm.  If the 
    algorithm verifies that they meet its criteria, an alert is sent
    to the email address in the config file.  

  Files:
  - filingsMonitor.js:  Checks the SEC website on regular intervals
    specified in config/feed.js for the most recent 10-K and 10-Q
    filings.  Alerts filingEvaluator.js on receipt of a new filing
    not already in the database.
  - filingEvaluator.js:  Checks a filing if it meets the specified
    criteria.  NOT YET IMPLEMENTED.

  Author:
  - Joe Edwards, joe@joedevelops.com
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
        name: 'SECAlert-error',
        filename: './logs/SECAlert-error.log',
        level: 'error',
        timestamp: true,
      }),
      new (logger.transports.File) ({
        name: 'SECAlert-info',
        filename: './logs/SECAlert-info.log',
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
    This program actively monitors the SEC for new 10-Q/K reports.
*/
var filingsMonitor = new (forever.Monitor)('./modules/filingsMonitor.js');
filingsMonitor.start();


/*
  Filing Evaluator:
    This program evaluates new filings.
*/
var filingEvaluator = new (forever.Monitor)('./modules/filingEvaluator.js');
filingEvaluator.start();


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