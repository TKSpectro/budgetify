import { PrismaClient } from '@prisma/client';
import { expect } from 'chai';
import { ChildProcess, exec, spawn } from 'child_process';
import psTree from 'ps-tree';
import { Response } from 'supertest';
const util = require('util');
const execPromise = util.promisify(exec);
let nextProcess: ChildProcess;

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getData(res: Response) {
  expect(res?.body, 'Response object does not contain any data.').to.have.property('data');

  if (res.error) {
    console.error(res.error);
  }
  if (res.body.errors) {
    console.error(res.body.errors);
  }

  return res.body.data;
}

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export const mochaHooks = {
  async beforeEach() {
    await prisma.invite.deleteMany();

    await prisma.groupTransaction.deleteMany();
    await prisma.threshold.deleteMany();
    await prisma.group.deleteMany();

    await prisma.recurringPayment.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.category.deleteMany;

    await prisma.household.deleteMany();

    await prisma.user.deleteMany();
  },
};

export async function mochaGlobalSetup() {
  console.info('Running Mocha Global Setup \n\n');

  // Overwrite Database URL to point at the test database (see @docker-compose.yml)
  process.env.DATABASE_URL =
    'postgresql://postgres:budgetify@localhost:5433/budgetifytest?schema=public';

  try {
    console.info('Build Project');
    const { stderr: buildErr } = await execPromise('npm run build');
    buildErr && console.error(buildErr);
    !buildErr && console.info('Build succeeded');

    const { stderr: dockerUpErr } = await execPromise(
      'docker-compose up -d --force-recreate -V dbtest',
    );
    dockerUpErr && console.error(dockerUpErr);

    // Wait so that the db is safely up
    await sleep(4000);

    console.info('Reset database');
    const { stderr: prismaResetErr } = await execPromise(
      'npx prisma migrate reset --force --skip-seed',
    );
    prismaResetErr && console.error(prismaResetErr);
    !prismaResetErr && console.info('Database reset \n');

    console.info('Start Server');
    nextProcess = spawn('npm', ['run', 'start']);

    nextProcess.stdout?.on('data', (data) => {
      if (data.toString().indexOf('ready') != -1) {
        console.info('Server started \n');
      }
    });

    nextProcess.stderr?.on('data', (data) => {
      console.error(data.toString());
    });

    await sleep(4000);
  } catch (error) {
    console.error(error);
  }
  console.info('Finished Mocha Global Setup');
}

export async function mochaGlobalTeardown() {
  console.info('Running Mocha Global Teardown \n');

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
    console.info('Stopped server \n');
  }

  const { stderr: dockerDownErr } = await execPromise('docker-compose rm -s -v -f dbtest');
  dockerDownErr && console.error(dockerDownErr);

  console.info('Finished Mocha Global Teardown');
}
