import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.page';
import { DashboardPage } from '../pages/Dashboard.page';
import { TaskDetailsPage } from '../pages/TaskDetails.page';
import { uploadFixture } from '../plugins/sftp';
import { mongodb } from '../plugins/db';

const QUEUE_NAME = 'Commercial';
const TASK_NAME = '3453126';
const PR_CODE_3_LABEL = '3 Pending: Requesting Medical Records';
const ASSIGN_NOTE = 'this is for automation testing';
const COMPLETE_NOTE = 'completed by automation testing';
/** PR-3 lookup automation.holdDuration.duration */
const HOLD_DAYS = 7;

const ARDB_FILE = process.env.ARDB_FIXTURE || '3453126(IB-IBD).xlsx';
const ARDB_REMOTE = process.env.ARDB_REMOTE_PATH || `/qa/ardb/${ARDB_FILE}`;

const EDI835_FILE = process.env.EDI835_FIXTURE || '3453126.edi';
const EDI835_REMOTE =
  process.env.EDI835_REMOTE_PATH || `/qa/edi_835/${EDI835_FILE}`;

const TASKS_COLLECTION = process.env.MONGODB_TASKS_COLLECTION || 'tasks';

const POLL_TIMEOUT_MS = 100_000;
const POLL_INTERVAL_MS = 10_000;
const TEST_TIMEOUT_MS = 480_000;

async function pollUntilTasksExist(message: string): Promise<void> {
  await expect
    .poll(
      async () => {
        const tasks = await mongodb.findAll(TASKS_COLLECTION, {});
        return tasks.length;
      },
      {
        message,
        timeout: POLL_TIMEOUT_MS,
        intervals: [POLL_INTERVAL_MS],
      }
    )
    .toBeGreaterThan(0);
}

test.afterAll(async () => {
  await mongodb.close();
});

test('ARDB + EDI835 ingest, complete with PR-3, verify On-Hold', async ({
  page,
}) => {
  test.setTimeout(TEST_TIMEOUT_MS);

  // 1. Drop ARDB file → poll until tasks exist in DB
  const ardbUpload = await uploadFixture(ARDB_FILE, ARDB_REMOTE);
  expect(ardbUpload).toBe('uploaded');

  await pollUntilTasksExist(
    'Tasks were not created in MongoDB after ARDB drop'
  );

  // 2. Drop EDI835 file → poll until tasks exist in DB
  const ediUpload = await uploadFixture(EDI835_FILE, EDI835_REMOTE);
  expect(ediUpload).toBe('uploaded');

  await pollUntilTasksExist(
    'Tasks were not present in MongoDB after EDI835 drop'
  );

  // 3. Login → Commercial queue → verify task listed
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithEnv();
  await loginPage.expectSuccessfulLogin();

  const dashboard = new DashboardPage(page);
  await dashboard.expectDashboardLoaded();
  await dashboard.expectQueueVisible(QUEUE_NAME);
  await dashboard.searchTasksInQueue(QUEUE_NAME, TASK_NAME);
  await dashboard.expectTaskInQueue(QUEUE_NAME, TASK_NAME);

  // 4. Set work status Available → open task → Assign → PR-3 → Complete → On-Hold
  await dashboard.setWorkStatusAvailable();
  await dashboard.openTaskInQueue(QUEUE_NAME, TASK_NAME);

  const taskDetails = new TaskDetailsPage(page);
  await taskDetails.expectLoaded();
  await taskDetails.assignToMeIfNeeded(ASSIGN_NOTE);
  await taskDetails.setPrCodeOnAllPaymentLines(PR_CODE_3_LABEL);
  await taskDetails.clickComplete();
  await taskDetails.fillCompleteNoteAndConfirm(COMPLETE_NOTE);

  // 5. Back on dashboard: On-Hold filter + hold chip shows 7 days
  await dashboard.goto();
  await dashboard.expectDashboardLoaded();
  await dashboard.expectQueueVisible(QUEUE_NAME);
  await dashboard.expectTaskInOnHoldFilter(QUEUE_NAME, TASK_NAME, HOLD_DAYS);
});
