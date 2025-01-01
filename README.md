<div
                  className={classNames(
                    "relative h-full p-2 bg-red-500 overflow-hidden",
                    {
                      "min-h-[10rem] md:min-h-[75vh]": true,
                    }
                  )}
                >
                  <img
                    src=""
                    alt=""
                    className="hidden h-full rounded-xl"
                  />
                </div>
                <div
                  className={classNames("py-40 h-full relative space-y-6", {
                    "min-h-[10rem] md:min-h-[75vh]": true,
                  })}
                  data-main
                >
                  <div className="flex flex-col items-start">
                    <div className="px-6 py-6 inline-block mx-auto rounded-t-3xl bg-gray-400/40 md:px-4">
                      <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zenos-100/65 via-zenos-300/80 to-zenos-500 md:text-6xl lg:text-9xl">
                        Grooming
                      </p>
                    </div>
                    <div className="px-6 py-6 inline-block mx-auto rounded-3xl bg-gray-400/40 md:px-4">
                      <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zenos-500 via-zenos-300/80 to-zenos-100/65 md:text-6xl lg:text-9xl">
                        Ultimate . Series
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-center tracking-wide md:text-xl">
                    Power Up Your Life: The Latest in Mobile; Accessories and
                    Gadgets
                  </p>
                  {/* Animation */}
                  <div className="bg-white absolute inset-0 bottom-0 -z-10 w-full flex items-end">
                    <Anime
                      height={25}
                      typeOfCanva="globe"
                      className="w-full h-[40rem] md:h-[40rem]"
                    />
                  </div>
                </div>