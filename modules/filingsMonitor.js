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

// For feed consumption
var config = require('../config/feed');
var parser = require('rss-parser');


/*
  FEED CONSUMPTION ==================================================
*/ 
var parseURLS = ()=> {
  // 10-K
  parser.parseURL(config.tenKURL, (err, parsed)=> {
    parsed.feed.entries.forEach( (entry)=> {
      // true argument = 10-K report
      validateFiling(entry, true);
    })
  });

  //10-Q
  parser.parseURL(config.tenQURL, (err, parsed)=> {
    parsed.feed.entries.forEach( (entry)=> {
      // false argument = 10-Q report
      validateFiling(entry, false);
    })
  });
}

// Timer for getting feed list
let parseTimer = setInterval(parseURLS, 1000 * 60);


/*
  FEED VALIDATION ===================================================
*/
var CIK_REGEX = /\(([0-9]{10})\)/;

var validateFiling = (entry, isKReport)=> {
  var cik = CIK_REGEX.exec(entry.title)[1];
  var type = isKReport ? 'K' : 'Q';
  var redisKey = cik + type;
  var newPubDate = moment(entry.pubDate.toString());

  redisClient.get(redisKey, (err, time)=> {
    let oldPubDate = moment(time);
    if(time === null || oldPubDate.isBefore(newPubDate)){

      redisClient.set(redisKey, newPubDate.toISOString());

      redisPubSub.emit('NEW_FILING', 
        {
          'cik': cik,
          'type': type,
        }
      );
    }
  });
};


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
logger.log('info', 'filingsMonitor launched.');

/*
  Redis
*/
redisPubSub.on('error', (err)=> {
  logger.log('error', 'Redis Pub/Sub Error: ' + JSON.stringify(err));
});

redisClient.on('error', (err)=> {
  logger.log('error', 'Redis Client Error: ' + JSON.stringify(err));
});