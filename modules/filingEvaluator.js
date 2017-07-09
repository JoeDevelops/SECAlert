/*
  This modules subscribes to the event 'NEW_FILING'.  It access all
  relevant company data by CIK.

  If the company's data meets the evalutation criteria it will publish
  the event 'CRITERIA_MET'.  This event will be monitored by 
  notifier.js to alert recipient to the company.

  TODO:
  1. Determine relevant data points
  2. Match data points to API calls.
  3. Configure API calls for data points
  4. Determine formula
  5. Send data to formula
  6. Publish event.

  Author:
  - Joe Edwards
  - joe@joedevelops.com
*/
'use strict';


/*
  DEPENDENCIES=======================================================
*/
var logger = require('winston');

// Redis Client and Publish/Subscribe
var RedisPubSub = require('node-redis-pubsub');
var redisPubSub = new RedisPubSub();
var Redis = require('redis');
var redisClient = Redis.createClient();


/*
  EVALUATE NEW FILING ===============================================
*/
redisPubSub.on('NEW_FILING', (filing)=> {
  console.log("Received New: " + JSON.stringify(filing));
  logger.log("info", 'New Filing: ' + JSON.stringify(filing));
});


/*
  LOGGING ===========================================================
*/

logger.configure(
  {
    transports: [
      new (logger.transports.File) ({
        name: 'filingEvaluator-error',
        filename: './logs/filingEvaluator-error.log',
        level: 'error',
        timestamp: true,
      }),
      new (logger.transports.File) ({
        name: 'filingEvaluator-info',
        filename: './logs/filingEvaluator-info.log',
        level: 'info',
        timestamp: true,
      }),
    ]
  }
);


/*
  LOG DECLARATIONS ==================================================
*/
logger.log('info', 'filingEvaluator launched.');

/*
  Redis
*/
redisPubSub.on('error', (err)=> {
  logger.log('error', 'Redis Pub/Sub Error: ' + JSON.stringify(err));
});

redisClient.on('error', (err)=> {
  logger.log('error', 'Redis Client Error: ' + JSON.stringify(err));
});