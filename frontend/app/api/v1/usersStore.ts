type User = {
  name?: string;
  email: string;
  password: string;
};

// In-memory user store for development/demo purposes.
// Module-level state persists across invocations while the dev server runs.
export const users = new Map<string, User>();
