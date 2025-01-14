import { LightGallery as ILightGallery } from "lightgallery/lightgallery";
import LightGallery from "lightgallery/react";
import { FC, useCallback, useRef, useState } from "react";
import Image from "./Image";

// import styles
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";
import ImageGallery from "react-image-gallery";

// import plugins if you need
import classNames from "classnames";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import _ from "lodash";

interface GallerySliderInterface {
  images?: { key?: string; original: string; thumbnail: string }[];
}
const GallerySlider: FC<GallerySliderInterface> = ({ images }) => {
  const containerRef = useRef(null);
  const lightGalleryRef = useRef<ILightGallery | null>(null);
  const [_galleryContainerOpen, _setGalleryContainerOpen] =
    useState<boolean>(false);

  const onInit = useCallback((detail: any) => {
    if (detail) {
      if (lightGalleryRef.current) {
      }
      lightGalleryRef.current = detail.instance;
      // detail.instance.openGallery();
    }
  }, []);
  return (
    <>
      <div
        className={classNames("h-screen inset-0 z-50 bg-red-500 hidden")}
        ref={containerRef}
      ></div>

      <ImageGallery
        items={
          _.map(images, (value) => ({
            ...value,
            loading: "eager",
            originalClass: "bg-zenos-400/20 rounded-xl",
            thumbnailClass: "border foc",
          })) as any
        }
        renderItem={({ original }) => (
          <Image
            onClick={() => {
              lightGalleryRef.current?.openGallery();
            }}
            src={original}
            className="w-full object-contain"
          />
        )}
        renderThumbInner={({ thumbnail, thumbnailAlt, thumbnailClass }) =>
          thumbnail && (
            <Image
              src={thumbnail}
              className={classNames("w-full object-contain", thumbnailClass)}
              alt={thumbnailAlt}
            />
          )
        }
        showFullscreenButton={false}
        useBrowserFullscreen={false}
        showPlayButton={false}
        renderRightNav={(onClick, disabled) => (
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="absolute top-2/4 right-2 z-20 bg-zenos-500/60 hover:bg-zenos-600 rounded-lg inline !w-auto !p-0 disabled:hidden"
          >
            <svg
              className="w-12 h-12 text-white"
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
                strokeWidth="2"
                d="m10 16 4-4-4-4"
              />
            </svg>
          </button>
        )}
        renderLeftNav={(onClick, disabled) => (
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="absolute top-2/4 left-2 z-20 bg-zenos-500/60 hover:bg-zenos-600 rounded-lg inline !w-auto !p-0 disabled:hidden"
          >
            <svg
              className="w-12 h-12 text-white"
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
                strokeWidth="1.5"
                d="m14 8-4 4 4 4"
              />
            </svg>
          </button>
        )}
      />
      <div>
        <LightGallery
          container={containerRef.current}
          appendSubHtmlTo={".lg-item"}
          dynamic={true}
          // onAfterOpen={() => {
          // }}
          // onAfterClose={({}) => {
          //   setGalleryContainerOpen(false);
          // }}
          {...{
            onInit,
            plugins: [lgThumbnail, lgZoom],
            dynamicEl: [
              ..._.map(images, (item) => ({
                src: item.original,
                thumb: item.original,
              })),
            ],
          }}
        ></LightGallery>
      </div>
    </>
  );
};

export default GallerySlider;
