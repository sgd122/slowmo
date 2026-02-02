import { test as base, expect } from '@playwright/test';
import path from 'path';

// 인증된 사용자 fixture
export const test = base.extend<{}, { workerStorageState: string }>({
  // 워커당 한 번 인증 상태 로드
  workerStorageState: [
    async ({}, use) => {
      const authFile = path.join(__dirname, '../.playwright/.auth/user.json');
      await use(authFile);
    },
    { scope: 'worker' },
  ],

  // 인증된 상태로 브라우저 컨텍스트 생성
  storageState: async ({ workerStorageState }, use) => {
    await use(workerStorageState);
  },
});

export { expect };
