let sessionCallCount = 0;
let userCallCount = 0;

export function logGetSession(caller = "") {
  sessionCallCount++;
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[🟢 Supabase getSession 호출] (${caller}) - 총 ${sessionCallCount}회`,
    );
  }
}

export function logGetUser(caller = "") {
  userCallCount++;
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[🟡 Supabase getUser 호출] (${caller}) - 총 ${userCallCount}회`,
    );
  }
}
