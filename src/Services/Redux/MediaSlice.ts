import { MediaItemInterface, MediaMimeType } from "@/Types/Media";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MediaModalInterface {
  mediaType?: MediaMimeType[];
  name?: string | null;
  placeholder?: string | null;
  multiSelect: boolean;
  show: boolean;
  selectedItems?: MediaItemInterface[] | null;
}

const initialState: MediaModalInterface = {
  mediaType: ["image", "video"],
  name: null,
  placeholder: null,
  multiSelect: false,
  show: false,
  selectedItems: null,
};

export const MediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMediaModalOnChange: (
      state,
      action: PayloadAction<{ multiSelect: boolean }>
    ) => {
      state.multiSelect = action.payload.multiSelect;
    },
    setModalState: (state, action: PayloadAction<{ multiSelect: boolean }>) => {
      state.multiSelect = action.payload.multiSelect;
      state.show = !state.show;
    },
    setMediaModalItems: (state, action: PayloadAction<any>) => {
      state.selectedItems = action.payload;
    },
  },
});

export const { setMediaModalOnChange, setModalState, setMediaModalItems } =
  MediaSlice.actions;
export default MediaSlice.reducer;
