const fs = require('fs');
const path = require('path');
module.fileCount = 0;

function readdir(path) {
  // Promise-based version of readdir.
  return new Promise((resolve, reject) => {
    // Wrap the underlying operation in a promise.
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function determineType(parentPath, childPath) {
  // Promise-based function to determine if the path is a file or directory.
  return new Promise((resolve, reject) => {
    fs.stat(path.join(parentPath, childPath), (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          path: childPath,
          type: stats.isDirectory() ? 'directory' : 'file', // Check if it's a directory or a file.
        });
      }
    });
  });
}

function determineTypes(parentPath, paths) {
  // Async function to determine if child paths are directories or files.

  return Promise.all(
    paths.map(
      (childPath) => determineType(parentPath, childPath) // Is the path a directory or a file?
    )
  );
}

function readdirTree(rootPath) {
  // Read an entire directory tree, the promise-based recursive version.
  return readdir(rootPath) // Initial non-recursive directory read.
    .then((childPaths) => determineTypes(rootPath, childPaths)) 
    .then((children) => {
      return Promise.all(
        children.map((child) => {
            if (child.type === 'directory') {
              return readdirTree(rootPath + '/' + child.path) // It's a directory, recurse to the next level down.
                .then((subTree) => {
                  return {
                    path: child.path,
                    subTree: subTree,
                  };
                });
            } else {
              module.fileCount += 1;
              child.subTree = true;
              return child;
            }
          })
      );
    })
    .then((children) => {
      const tree = {}; // Reorganize the list of directories into a tree.
      children.forEach((directory) => {
        tree[directory.path] = directory.subTree;
      });
      return tree;
    });
}

readdirTree(process.argv[2])
  .then((tree) => {
    console.log(path.basename(process.argv[2]));
    console.log('\x1b[35m%s\x1b[0m', 'File Count -->' + ' ' + module.fileCount);
    console.log(tree);
  })
  .catch((err) => {
    console.error('error:');
    console.error(err);
  });
