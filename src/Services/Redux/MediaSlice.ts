import { MediaMimeType, ModalInterface } from "@/Types/Media";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

interface MediaModalInterface {
  mediaType?: MediaMimeType[];
  name?: string | null;
  placeholder?: string | null;
  onChange?: any;
  multiSelect: boolean,
  modal?: ModalInterface;
}

const initialState: MediaModalInterface = {
  mediaType: ["image", "video"],
  name: null,
  placeholder: null,
  multiSelect: false
};

export const MediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMediaModalOnChange: (
      state,
      action: PayloadAction<{ onChange?: any; multiSelect: boolean }>
    ) => {
      if (state.modal) {
        state.multiSelect = action.payload.multiSelect
        state.onChange = action.payload.onChange;
      }
    },
    setModalInstance: (state, action) => {
      // console.log("setting modal", action.payload);
      state.modal = action.payload;
    },
  },
});

export const { setMediaModalOnChange, setModalInstance } = MediaSlice.actions;
export default MediaSlice.reducer;
