import { useMediaFile } from "@/Services/Hooks";
import { queryToDeleteFiles } from "@/Services/Queries/MediaQuery";
import { fm, shorten } from "@/System/function";
import { MediaItemInterface, ModalInterface } from "@/Types/Media";
import classNames from "classnames";
import { initFlowbite } from "flowbite";
import _ from "lodash";
import moment from "moment";
import { useEffect } from "react";

const MediaItem: React.FC<{
  item: MediaItemInterface;
  modal?: ModalInterface;
  onBlur?: any;
  onChange?: any;
  showThumbnail?: boolean;
  multiSelect?: boolean;
  onSelect?: any;
  clearSelect?: any;
}> = ({
  item,
  modal,
  onBlur,
  onChange,
  showThumbnail = false,
  multiSelect,
  onSelect,
  clearSelect,
}) => {
  const type = _.split(item?.media?.mimetype, "/")[0];
  const { data: src } = useMediaFile(item?.media?.name, "w1280", type);
  const { media, createdAt, updatedAt } = item;
  const createdAtDate = moment(fm(createdAt));
  const updateAtDate = moment(fm(updatedAt));
  useEffect(() => {
    initFlowbite();
  }, [src, item]);
  const MediaOnChange = (data: any) => {
    // if not multiselect, choose a file and continue
    if (!multiSelect) {
      modal?.hide();
      onChange(data);
      clearSelect();
    } else {
      // if multiselect, select file
      onSelect();
    }
  };
  return (
    <div
      onBlur={onBlur}
      className={`relative z-10 ${
        showThumbnail ? "h-full" : "h-auto"
      } bg-zenos-400 bg-opacity-50 rounded-md border-0 overflow-hidden group`}
    >
      {/* Button to Select media */}
      {!showThumbnail && multiSelect && (
        <button
          type="button"
          onClick={onSelect}
          className={classNames(
            "absolute top-1 left-1 z-20 w-6 h-6 border-2 border-white rounded-md flex items-center justify-center",
            { "bg-emerald-500/55": item._selected }
          )}
        >
          {!!item._selected && (
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.8"
                d="M5 11.917 9.724 16.5 19 7.5"
              />
            </svg>
          )}
        </button>
      )}
      {!showThumbnail && (
        <button
          type="button"
          className={classNames(
            "absolute top-1 right-1 z-20 rounded-md bg-zenos-500 p-0.5 cursorpointer shadow-md"
          )}
          onClick={() => {
            // if modal is opened,
            queryToDeleteFiles(media.name);
          }}
        >
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>
        </button>
      )}
      {showThumbnail && !multiSelect && (
        <button
          type="button"
          className={classNames(
            "absolute top-1 left-1 z-20 rounded-md bg-zenos-500 p-0.5 cursorpointer shadow-md"
          )}
          onClick={() => {
            // remove file from form value
            MediaOnChange(null);
          }}
        >
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </button>
      )}

      {/* Showing Thumbnail and the rest */}
      <button
        type="button"
        // data-modal-hide="mediaModal"
        className={`border-0 relative w-full ${
          showThumbnail ? "h-full" : "h-auto"
        } rounded-md bg-center group ${
          !src
            ? "flex flex-col gap-1 items-center justify-center cursor-not-allowed px-3"
            : "flex items-stretch justify-center cursor-pointer"
        }`}
        onClick={() => {
          if (src && !showThumbnail) {
            return MediaOnChange({ ...item, ...{ src: src } });
          }
        }}
      >
        {(!src && (
          <>
            <svg
              className="w-full h-full text-gray-100"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mb-2 -mt-2 font-semibold text-gray-100 text-sm text-center">
              !! {_.upperFirst(type)} not found !!
            </span>
          </>
        )) || (
          <>
            {type == "image" && (
              <img
                src={`${src}`}
                className="w-full min-h-32 h-full object-contain"
                alt={media?.name}
              />
            )}
            {type != "image" && type != "video" && (
              <>
                <svg
                  className="w-full min-w-44 h-full min-h-44 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
            {type == "video" && (
              <video>
                <source src={src} />
              </video>
            )}
          </>
        )}
        <div className="hidden absolute inset-0 bg-gray-800 bg-opacity-40 transition-all ease-in-out delay-100 duration-200 group-hover:block">
          <div className="absolute text-[0.6rem] text-left pt-2 pb-1 leading-3 px-1 z-50 bottom-0 w-full bg-gray-200 text-gray-800 bg-opacity-90 font-medium">
            {(!showThumbnail && (
              <>
                <p className="">
                  <span className="font-semibold">File Name: </span>
                  <span>{media?.name}</span>
                </p>
                <p className="">
                  <span className="font-semibold">Hash: </span>
                  <span>{shorten(media.md5Hash as string, 1)}</span>
                </p>
                {createdAtDate.isValid() && (
                  <p className="">
                    <span className="font-semibold">Uploaded: </span>
                    <span>{createdAtDate.format("Do MMMM, YYYY hh:mma")}</span>
                    {/* 12th July, 2024 */}
                  </p>
                )}
                {updateAtDate.isValid() &&
                  !updateAtDate.isSame(createdAtDate) && (
                    <p className="">
                      <span className="font-semibold">Last Update: </span>
                      <span>
                        {moment(fm(updatedAt)).format("Do MMMM, YYYY hh:mma")}
                      </span>
                      {/* 12th July, 2024 */}
                    </p>
                  )}
              </>
            )) || <p className="font-semibold text-center">{media?.name}</p>}
          </div>
        </div>
      </button>
    </div>
  );
};

export default MediaItem;
