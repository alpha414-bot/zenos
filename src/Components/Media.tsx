import { useAppDispatch, useAppSelector } from "@/Services/Redux/Hook.ts";
import { setMediaModalOnChange } from "@/Services/Redux/MediaSlice.ts";
import { MediaItemInterface, MediaMimeType } from "@/Types/Media.js";
import _ from "lodash";
import React, { useEffect } from "react";
import { Control, RegisterOptions, useController } from "react-hook-form";
import MediaItem from "./MediaItem.tsx";

const Media: React.FC<{
  mediaType?: MediaMimeType[];
  name: string;
  placeholder?: string;
  control: Control;
  align?: "col" | "row" | "col-reverse" | "row-reverse";
  rules?: RegisterOptions;
  multiSelect: boolean;
}> = ({
  name,
  placeholder,
  control,
  align = "row",
  rules,
  multiSelect,
  // mediaType = ["image", "video", "document", "others"],
}) => {
  const dispatch = useAppDispatch();
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });
  const { modal } = useAppSelector((state) => state.media);
  useEffect(() => {
    // Reset media value if multiSelect is changed
    onChange(null);
  }, [multiSelect]);
  return (
    <>
      <div
        className={`p-3 flex flex-col items-stretch gap-4 md:flex-${align} md:p-0`}
      >
        <button
          id={`${name}MediaButton`}
          onClick={() => {
            dispatch(setMediaModalOnChange({ onChange, multiSelect }));
            modal?.show();
          }}
          type="button"
          className="w-full cursorpointer text-center text-lg font-bold flex flex-col gap-y-2 items-center justify-center py-6 px-2 border-4 border-white border-dotted rounded-lg text-white min-h-56 tracking-wider"
        >
          <svg
            className="w-12 h-12"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
            <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
          <span dangerouslySetInnerHTML={{ __html: placeholder || "" }} />
        </button>
        {(!!value && !value?.length && !!value.slug && (
          <div className="md:max-w-60">
            <MediaItem
              item={value}
              showThumbnail
              onChange={onChange}
              onBlur={onBlur}
            />
          </div>
        )) ||
          (value?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 w-">
              {value.map((item: any, i: any) => (
                <MediaItem
                  key={i}
                  item={item}
                  showThumbnail
                  onChange={onChange}
                  onBlur={onBlur}
                  multiSelect={multiSelect}
                  clearSelect={(e: MediaItemInterface) => {
                    if (e) {
                      onChange(
                        _.filter(
                          value as MediaItemInterface[],
                          (a) =>
                            a?.media?.name.toLowerCase() !==
                            e.media?.name?.toLowerCase()
                        )
                      );
                    }
                  }}
                />
              ))}
            </div>
          ))}
      </div>
      {error && (
        <span
          className="block mt-0.5 mb-2.5 text-base tracking-wider font-medium underline underline-offset-4 decoration-dotted text-red-500"
          dangerouslySetInnerHTML={{
            __html: error.message || "Error encountered with the input",
          }}
        ></span>
      )}
    </>
  );
};

export default Media;
