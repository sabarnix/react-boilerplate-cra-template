#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 'use strict';

 // Makes the script crash on unhandled rejections instead of silently
 // ignoring them. In the future, promise rejections that are not handled will
 // terminate the Node.js process with a non-zero exit code.
 process.on('unhandledRejection', err => {
   throw err;
 });

 const fs = require('fs');
 const path = require('path');
 const spawn = require('react-dev-utils/crossSpawn');
 const args = process.argv.slice(2);

 const script = args[0];

 const scriptPath = path.resolve(__dirname, '../scripts/', script);

 console.log('here', process.execPath);

 if (fs.existsSync(scriptPath)) {
   const result = spawn.sync(
    'ts-node',
     []
       .concat(require.resolve(scriptPath)),
     { stdio: 'inherit' }
   );
   if (result.signal) {
     if (result.signal === 'SIGKILL') {
       console.log(
         'The build failed because the process exited too early. ' +
           'This probably means the system ran out of memory or someone called ' +
           '`kill -9` on the process.'
       );
     } else if (result.signal === 'SIGTERM') {
       console.log(
         'The build failed because the process exited too early. ' +
           'Someone might have called `kill` or `killall`, or the system could ' +
           'be shutting down.'
       );
     }
     process.exit(1);
   }
   process.exit(result.status);
 } else {
   console.log('Unknown script "' + script + '".');
   console.log('Perhaps you need to update rb-scripts?');
 }
