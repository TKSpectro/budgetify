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
    console.info('Build Project');
    const { stderr: buildErr } = await execPromise('npm run build');
    buildErr && console.error(buildErr);
    !buildErr && console.info('Build succeeded');

    console.info('Start database');
    const { stderr: dockerUpErr } = await execPromise('docker-compose up -d dbtest');
    dockerUpErr && console.error(dockerUpErr);
    !dockerUpErr && console.info('Database started');

    // Wait so that the db is safely up
    await sleep(4000);

    console.info('Reset database');
    const { stderr: prismaResetErr } = await execPromise(
      'npx prisma migrate reset --force --skip-seed',
    );
    prismaResetErr && console.error(prismaResetErr);
    !prismaResetErr && console.info('Database reseted');

    console.info('Start Server');
    nextProcess = spawn('npm', ['run', 'start']);

    nextProcess.stdout?.on('data', (data) => {
      if (data.toString().indexOf('ready') != -1) {
        console.info('Server started');
      }
    });

    nextProcess.stderr?.on('data', (data) => {
      console.error(data.toString());
    });

    await sleep(4000);
  } catch (error) {
    console.error(error);
  }
}

export async function mochaGlobalTeardown() {
  console.info('Running Mocha Global Teardown');

  // Kill all child processes because npm run spawns another child process
  if (nextProcess.pid) {
    console.info('Stopping server');
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
    console.info('Stopped server');
  }

  console.info('Stop database');
  const { stderr: dockerDownErr } = await execPromise('docker-compose down');
  dockerDownErr && console.error(dockerDownErr);
  !dockerDownErr && console.info('Stopped database');

  console.info('Finished Mocha Global Teardown');
}
