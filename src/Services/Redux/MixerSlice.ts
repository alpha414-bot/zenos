import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  mixerContainerEnabled: false,
};

const mixerSlice = createSlice({
  name: 'mixer',
  initialState,
  reducers: {
    setMixerContainerEnable(state, action: PayloadAction<any>) {
      console.log("payload", action.payload);
      state.mixerContainerEnabled = action.payload;
    },
  },
});

export const { setMixerContainerEnable } = mixerSlice.actions;
export default mixerSlice.reducer;