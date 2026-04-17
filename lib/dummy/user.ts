export interface DummyUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const dummyUser: DummyUser = {
  id: "user_1",
  name: "Alexander Hall",
  email: "alexander@example.edu",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
};
