var fs = require('fs'),
var util = require('util');
path = require('path');

function dirTree(filename) {
  // Get the stats to check whether it is a file or folder
  var stats = fs.lstatSync(filename),
    info = {
      [path.basename(filename)]: {},
    };

  if (stats.isDirectory()) {
    // Assuming it's a folder
    info[path.basename(filename)] = fs
      .readdirSync(filename)
      .map(function (child) {
        return dirTree(filename + '/' + child);
      });
  } else {
    // Assuming it's a file
    module.fileCount += 1;

    info[path.basename(filename)] = true;
  }

  return info;
}n

console.log('\x1b[35m%s\x1b[0m', 'File Count -->' + ' ' + module.fileCount);
console.log(util.inspect(dirTree(process.argv[2]), false, null));
