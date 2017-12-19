require("babel-register")({
    // Optional only regex - if any filenames **don't** match this regex then they
    // aren't compiled
    only: /src/,
  
  
    // Setting this to false will disable the cache.
    cache: true
  });
require("./app")