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
  console.info('Running Mocha Global Setup');

  // Overwrite Database URL to point at the test database (see @docker-compose.yml)
  process.env.DATABASE_URL =
    'postgresql://postgres:budgetify@localhost:5433/budgetifytest?schema=public';

  try {
    console.info('Building Project');
    const { stdout, stderr } = await execPromise('npm run build');
    stderr && console.error(stderr);
    stdout && console.info('Build succeeded');

    console.info('Run docker-compose up');
    const { stderr: dockerUpErr } = await execPromise('docker-compose up -d dbtest');
    dockerUpErr && console.error(dockerUpErr);

    console.info('Run prisma reset');
    const { stderr: prismaResetErr } = await execPromise(
      'npx prisma migrate reset --force --skip-seed',
    );
    prismaResetErr && console.error(prismaResetErr);

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

  console.info('docker-compose down');
  const { stderr: dockerDownErr } = await execPromise('docker-compose down');
  dockerDownErr && console.error(dockerDownErr);

  console.info('Finished Mocha Global Teardown');
}
