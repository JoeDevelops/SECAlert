var feed = {};

feed.tenQURL = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=10-Q&company=&dateb=&owner=include&start=0&count=40&output=atom";
feed.tenKURL = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=10-K&company=&dateb=&owner=include&start=0&count=40&output=atom";
feed.parseInterval = 1;

module.exports = feed;