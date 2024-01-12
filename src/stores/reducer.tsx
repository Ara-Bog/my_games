import { CounterState, UserData, User } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CounterState & UserData = {
  value: 0,
  user: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setUserData: (state, { payload: { user } }: PayloadAction<{ user: User | null }>) => {
      state.user = user;
    },
  },
});

export const { increment, decrement, incrementByAmount, setUserData } = counterSlice.actions;

export default counterSlice.reducer;
