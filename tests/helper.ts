import { ChildProcess, exec, spawn } from 'child_process';
import psTree from 'ps-tree';
const util = require('util');
const execPromise = util.promisify(exec);
let nextProcess: ChildProcess;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function mochaGlobalSetup() {
  console.log('Running Mocha Global Setup');

  try {
    console.info('Building Project');

    const { stdout, stderr } = await execPromise('npm run build');
    stderr && console.log(stderr);
    stdout && console.log('Build succeeded');

    console.info('Starting Server');
    nextProcess = spawn('npm', ['run', 'start']);

    nextProcess.stdout?.on('data', (data) => {
      if (data.toString().indexOf('ready') != -1) {
        console.info('Server started');
      }
    });

    await sleep(1000);
  } catch (error) {
    console.error(error);
  }
}

export async function mochaGlobalTeardown() {
  console.info('Running Mocha Global Teardown');

  if (nextProcess.pid) {
    psTree(nextProcess.pid, function (err, children) {
      spawn(
        'kill',
        ['-9'].concat(
          children.map(function (p) {
            return p.PID;
          }),
        ),
      );
    });
  }

  return 0;
}
