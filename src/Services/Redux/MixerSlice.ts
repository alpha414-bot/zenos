import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MixerInterface {
  mixerContainerState: boolean;
}

const initialState: MixerInterface = {
  mixerContainerState: false,
};

export const MixerSlice = createSlice({
  name: "mixer",
  initialState,
  reducers: {
    setMixerContainerEnable: (state, action: PayloadAction<boolean>) => {
      state.mixerContainerState = action.payload;
    },
  },
});

export const { setMixerContainerEnable } = MixerSlice.actions;
export default MixerSlice.reducer;
