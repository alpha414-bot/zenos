import { auth } from "@/firebase-config";
import { useUserMedia } from "@/Services/Hook";
import { queryToUploadFiles } from "@/Services/Queries/MediaQuery.ts";
import { useAppDispatch, useAppSelector } from "@/Services/Redux/Hook";
import { setModalInstance } from "@/Services/Redux/MediaSlice";
import { getFileExtension, MIME_TYPE } from "@/System/function";
import {
  ExtensionType,
  FileInterface,
  MediaItemInterface,
  MimesType,
} from "@/Types/Media.js";
import classNames from "classnames";
import { InstanceOptions, Modal } from "flowbite";
import _ from "lodash";
import { useCallback, useLayoutEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import MediaComponent from "./MediaComponent";

const MediaModalContext = () => {
  const dispatch = useAppDispatch();
  const { multiSelect, mediaType, name, onChange } = useAppSelector(
    (state) => state.media
  );
  const [isMediaUploading, setIsImageUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MediaItemInterface[]>([]);
  const { data: medias } = useUserMedia();
  const [modal, setModal] = useState<Modal>();
  const onDrop = useCallback(async (acceptedFiles?: any) => {
    // Do something with the files
    console.log("dropped file", acceptedFiles);
    return true;
    // Use the Inertia.post method to send the file to your Laravel backend.
    if (acceptedFiles.length > 0) {
      // acceptedFiles has files in it and it is not empty
      // // uploading file
      setIsImageUploading(true);
      setTimeout(() => {
        queryToUploadFiles(
          acceptedFiles,
          `/uploads/${auth.currentUser?.uid || "app"}`
        ).finally(() => {
          setIsImageUploading(false);
        });
      }, 0 * 1000); // 5 seconds
    }
    return acceptedFiles;
  }, []);
  let extensions: MimesType = {};

  if (mediaType) {
    for (const mime of mediaType) {
      let extensionsForMimeType = MIME_TYPE[mime + "/*"] as ExtensionType[];
      extensions[mime + "/*"] = extensionsForMimeType ?? [];
    }
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      // onDrop: (files) => console.log(files),
      onDrop,
      multiple: true,
      useFsAccessApi: false,
      onError: (err) => {
        console.log("there was an error", err.message, err.stack, err.name);
      },
      // getFilesFromEvent:(event)=>new Promise((resolve, reject)=>{
      //   const
      //   resolve()
      // }),
      // maxFiles: multiSelect ? 6 : 1,
      // validator: (file) => {
      //   // check the file extension is among the media accepted type\
      //   const FILE_EXTENSION = getFileExtension(file.name);
      //   if (!_.includes(_.flatMap(extensions), "." + FILE_EXTENSION)) {
      //     return {
      //       code: "file-is-not-valid",
      //       message:
      //         "File is not among the valid accepted media types, which are " +
      //         _.join(_.flatMap(extensions), ", "),
      //     };
      //   }
      //   return null;
      // },
    });

  useLayoutEffect(() => {
    const $targetEl: HTMLElement | null = document.getElementById(`MediaModal`);
    // instance options object
    const instanceOptions: InstanceOptions = {
      id: "mediaModal",
      override: true,
    };
    const modalInstance = new Modal(
      $targetEl,
      {
        placement: "bottom-right",
        backdrop: "dynamic",
        closable: true,
      },
      instanceOptions
    );
    setModal(modalInstance);
    dispatch(setModalInstance(modalInstance));
    return modalInstance.hide();
  }, []);

  const selectMultiMedia = (file: any) => {
    if (medias && medias?.length > 0) {
      const fileExistInSelectModule = selectedFiles.filter(
        (select) => select.id === file?.id
      );
      if (fileExistInSelectModule.length == 0) {
        // Add file to selection
        setSelectedFiles(_.concat(selectedFiles, file));
      } else {
        // Remove file from selection
        setSelectedFiles(
          _.filter(selectedFiles, (item) => item.id !== file.id)
        );
      }
    }
  };
  return (
    <>
      <div
        id={`MediaModal`}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto bg-gray-900/70 overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
      >
        <div className="relative w-full max-w-2xl h-auto overflow-hidden">
          {/* Modal content */}
          <div className="relative text-center max-h-[90vh] overflow-y-auto scroll-smooth bg-gray-800 rounded-lg shadow sm:p-5">
            <div className="">
              <div>
                <div className="sticky top-0 pt-6 z-50 block glass-back rotate-0 rounded border-b border-gray-200 space-y-2">
                  {/* Tab List */}
                  <ul
                    className="flex flex-wrap items-center justify-center -mb-px font-medium text-center md:justify-start px-2"
                    id="media-tab"
                    data-tabs-toggle="#media-tab-content"
                    data-tabs-active-classes="font-medium border-b-4 text-zenos-500 hover:text-zenos-600 border-zenos-600"
                    data-tabs-inactive-classes="font-medium text-white hover:text-gray-400 border-gray-100 hover:border-gray-300"
                    role="tablist"
                  >
                    {mediaType &&
                      mediaType.map((media_name, index) => {
                        return (
                          <li key={index} className="me-5" role="presentation">
                            <button
                              className="inline-block p-1 rounded-t-lg text-xl"
                              id="media-tab"
                              data-tabs-target={`#${media_name}_tab_${name}Modal`}
                              type="button"
                              role="tab"
                              aria-controls={media_name}
                              aria-selected="false"
                            >
                              {_.startCase(media_name)}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                  {/* Multi Selected Panel */}
                  <div
                    className={classNames(
                      "animate-slidedown w-full bg-zenos-500 px-4 py-1 flex flex-row justify-between",
                      {
                        "hidden ": !multiSelect || selectedFiles.length == 0, // hide if multiselect is false or no files is selected yet
                      }
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-6 h-6 border border-white bg-white/30 rounded flex items-center justify-center"
                        onClick={() => setSelectedFiles([])}
                      >
                        <svg
                          className="w-4 h-4 text-white"
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
                            d="M5 12h14"
                          />
                        </svg>
                      </button>
                      <p className="text-lg font-medium">
                        {selectedFiles.length} Selected
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        onChange(
                          selectedFiles.length > 0 ? selectedFiles : null
                        );
                        modal?.hide();
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                {/* Tab Panels */}
                <div id="media-tab-content">
                  {mediaType &&
                    mediaType.map((media_name, index) => {
                      return (
                        <div
                          key={index}
                          className="hidden p-2"
                          // id={`${media_name}_tab`}
                          id={`${media_name}_tab_${name}Modal`}
                          role="tabpanel"
                          aria-labelledby={`${media_name}-tab`}
                        >
                          {(_.includes(mediaType, media_name) && (
                            <>
                              <div className="py-6 ">
                                <div className="grid grid-col grid-cols-2 items-start flex-wrap gap-3 md:grid-cols-3">
                                  {(isMediaUploading && (
                                    <>
                                      <div className="h-44 bg-zenos-400 rounded-md border-2 border-zenos-500 p-2 cursor-not-allowed flex flex-col items-center justify-center gap-y-1.5">
                                        <svg
                                          className="w-12 h-12 text-red-700"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={24}
                                          height={24}
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M13.383 4.076a6.5 6.5 0 0 0-6.887 3.95A5 5 0 0 0 7 18h3v-4a2 2 0 0 1-1.414-3.414l2-2a2 2 0 0 1 2.828 0l2 2A2 2 0 0 1 14 14v4h4a4 4 0 0 0 .988-7.876 6.5 6.5 0 0 0-5.605-6.048Z" />
                                          <path d="M12.707 9.293a1 1 0 0 0-1.414 0l-2 2a1 1 0 1 0 1.414 1.414l.293-.293V19a1 1 0 1 0 2 0v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-2-2Z" />
                                        </svg>

                                        <p className="text-red-700  font-semibold text-center text-sm">
                                          Wait!, upload is in progress...
                                        </p>
                                      </div>
                                    </>
                                  )) || (
                                    <div
                                      {...getRootProps()}
                                      className="h-44 bg-zenos-400 rounded-md border-2 border-zenos-500 p-2 flex items-center justify-center cursor-pointer"
                                    >
                                      <input {...getInputProps()} />
                                      {isDragActive ? (
                                        <p className="text-center text-sm text-white font-bold">
                                          Drop the files here ...
                                        </p>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center gap-y-1.5">
                                          <svg
                                            className="w-[45px] h-[45px] text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
                                            <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                          </svg>
                                          <p className="text-center text-sm text-white font-bold">
                                            Drag & drop some files here, or
                                            click to select files.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {medias &&
                                    medias
                                      .filter((media) => {
                                        const { media: File } = media;
                                        const fileExtension = getFileExtension(
                                          File.name
                                        );
                                        const MimeExtensions =
                                          MIME_TYPE[`${media_name}/*`];
                                        if (
                                          MimeExtensions &&
                                          MimeExtensions.includes(
                                            `.${fileExtension}` as any
                                          )
                                        ) {
                                          return media;
                                        }
                                      })
                                      .map((item) => ({
                                        ...item,
                                        ...{
                                          _selected:
                                            selectedFiles.filter(
                                              (select) => select?.id === item.id
                                            ).length > 0,
                                        },
                                      }))
                                      .map((item, index) => (
                                        <MediaComponent
                                          modal={modal}
                                          key={index}
                                          item={item}
                                          multiSelect={multiSelect}
                                          onChange={onChange}
                                          onSelect={() =>
                                            selectMultiMedia(item)
                                          }
                                        />
                                      ))}
                                </div>
                              </div>
                            </>
                          )) || <p>No Media</p>}
                        </div>
                      );
                    })}
                </div>
              </div>
              <ul className="space-y-2 ">
                {fileRejections.map(
                  (item: { file: FileInterface; errors: any }, index) => {
                    return (
                      <li key={index} className="">
                        <span className="font-semibold text-white text-sm bg-red-400 rounded py-1 px-2">
                          {item?.file?.path}
                        </span>
                        <ul className="space-y-1 ml-5 mt-1">
                          {item.errors?.map((item: any, index: any) => (
                            <li key={index} className="break-words text-sm">
                              {item.message}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaModalContext;
