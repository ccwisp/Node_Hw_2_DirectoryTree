// Folder ' Nested Folder First ' is created for test reasons

const fs = require('fs');
const path = require('path');
module.fileCount = 0

function dirTree(filename) {
  // Get the stats to check whether it is a file or folder
  const stats = fs.lstatSync(filename),
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
}

console.log('\x1b[35m%s\x1b[0m', 'File Count -->' + ' ' + module.fileCount);

console.dir(dirTree(process.argv[2]), {
  depth: null
});