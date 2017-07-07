module.exports = (entry)=> {
  // TODO
  // 1. Get CIK w/ regex
  // 2. Get key from redis
  // 3. Compare pubdate
  //    if: more recent than last update pub date, send to algo
  //    else: ignore

  // NOTE:  entry from parsed.feed.entries has keys:
  //  'title', 'link', 'pubDate', 'id'
  console.log("VALIDATING: " + JSON.stringify(entry));
};