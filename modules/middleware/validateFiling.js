var moment = require('moment');

var CIK_REGEX = /\(([0-9]{10})\)/;

module.exports = (entry, isKReport, dbClient, dbPubSub)=> {
  let cik = CIK_REGEX.exec(entry.title)[1];
  let redisKey = cik + (isKReport ? 'K' : 'Q');
  var newPubDate = moment(entry.pubDate);

  dbClient.get(redisKey, (time)=> {
    if(time === null || newPubDate > moment(time)){
      // Set new time
      dbClient.set(redisKey, moment(time));

      // Emit new report
      dbPubSub.emit('NEW_FILING', JSON.stringify(
        {
          'type': (isKReport ? 'K' : 'Q'),
          'cik': cik,
        }
      ));
    }
  });
};