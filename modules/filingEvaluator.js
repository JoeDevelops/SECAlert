/*
  This modules monitors SEC filings every hour during the filing hours.
  If new reports are observed, it alerts the 

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