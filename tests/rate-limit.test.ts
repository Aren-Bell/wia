import { checkRateLimit } from "../lib/rate-limit";
import { isDuplicateRequest, debounce } from "../lib/debounce";
import assert from "assert";

async function runRateLimitTests() {
  console.log("=== [TEST SUITE] RATE LIMIT & DEBOUNCER ===");

  // Test 1: Sliding Window Rate Limiter
  console.log("-> Test 1: Testing Sliding Window Rate Limiter...");
  const testKey = `test_user_${Date.now()}`;
  const opts = { limit: 3, windowMs: 1000 };

  const r1 = checkRateLimit(testKey, opts);
  assert.strictEqual(r1.success, true);
  assert.strictEqual(r1.remaining, 2);

  const r2 = checkRateLimit(testKey, opts);
  assert.strictEqual(r2.success, true);
  assert.strictEqual(r2.remaining, 1);

  const r3 = checkRateLimit(testKey, opts);
  assert.strictEqual(r3.success, true);
  assert.strictEqual(r3.remaining, 0);

  // 4th request exceeds limit!
  const r4 = checkRateLimit(testKey, opts);
  assert.strictEqual(r4.success, false, "4th request must be blocked");
  assert.strictEqual(r4.remaining, 0);
  console.log("   PASS: Rate limiter correctly allowed 3 and blocked 4th request");

  // Test 2: Double-Click Deduplication
  console.log("-> Test 2: Testing Server Anti-Double-Click Guard...");
  const lockKey = `action_lock_${Date.now()}`;
  const isFirstDuplicate = isDuplicateRequest(lockKey, 500);
  assert.strictEqual(isFirstDuplicate, false, "First submission must NOT be duplicate");

  const isSecondDuplicate = isDuplicateRequest(lockKey, 500);
  assert.strictEqual(isSecondDuplicate, true, "Immediate second click MUST be flagged as duplicate");
  console.log("   PASS: Rapid double-click duplicate detected and blocked");

  // Test 3: Client Debounce Timer
  console.log("-> Test 3: Testing Client Debounce Utility...");
  let executionCount = 0;
  const debouncedFunc = debounce(() => {
    executionCount++;
  }, 50);

  debouncedFunc();
  debouncedFunc();
  debouncedFunc();
  assert.strictEqual(executionCount, 0, "Debounced function should not run immediately");

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.strictEqual(executionCount, 1, "Debounced function must only execute ONCE after cooldown");
  console.log("   PASS: Debouncer collapsed 3 rapid calls into 1 execution");

  console.log("=== RATE LIMIT & DEBOUNCER TESTS PASSED SUCCESSFULLY ===");
}

runRateLimitTests().catch((err) => {
  console.error("Test failed:", err);
  process.exitCode = 1;
});
