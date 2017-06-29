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
var moment = require('moment');

// Redis Client and Publish/Subscribe
var RedisPubSub = require('node-redis-pubsub');
var redisPubSub = new RedisPubSub();
var Redis = require('redis');
var redisClient = Redis.createClient();


/*
  LOGGING ===========================================================
*/

logger.configure(
  {
    transports: [
      new (logger.transports.File) ({
        name: 'filingsMonitor-error',
        filename: './logs/filingsMonitor-error.log',
        level: 'error',
        timestamp: true,
      }),
      new (logger.transports.File) ({
        name: 'filingsMonitor-info',
        filename: './logs/filingsMonitor-info.log',
        level: 'info',
        timestamp: true,
      }),
    ]
  }
);





/*
  LOG DECLARATIONS ==================================================
*/
logger.log('info', 'serialManager launched.');

/*
  Redis
*/
redisPubSub.on('error', (err)=> {
  logger.log('error', 'Redis Pub/Sub Error: ' + JSON.stringify(err));
});

redisClient.on('error', (err)=> {
  logger.log('error', 'Redis Client Error: ' + JSON.stringify(err));
});