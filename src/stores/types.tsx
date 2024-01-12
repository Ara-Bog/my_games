export interface CounterState {
  value: number;
}
export type User = {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
};

export interface UserData {
  user: User | null;
}
