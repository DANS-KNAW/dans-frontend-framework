"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Material } from "./support-materials";

interface DocumentModelProps {
  material: Material;
}

export default function DocumentModel({ material }: DocumentModelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="tw:text-base tw:hover:text-[#4F8E31] tw:hover:cursor-pointer tw:hover:underline"
      >
        {material.topic}
      </button>
      <Dialog
        open={open}
        onClose={setOpen}
        className="tw:relative tw:z-[99999999999]"
      >
        <DialogBackdrop
          transition
          className="tw:fixed tw:inset-0 tw:bg-gray-500/75 tw:transition-opacity tw:data-closed:opacity-0 tw:data-enter:duration-300 tw:data-enter:ease-out tw:data-leave:duration-200 tw:data-leave:ease-in"
        />

        <div className="tw:fixed tw:inset-0 tw:z-10 tw:w-screen tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-end tw:justify-center tw:p-4 tw:text-center tw:sm:items-center tw:sm:p-0">
            <DialogPanel
              transition
              className="tw:relative tw:transform tw:overflow-hidden tw:rounded-lg tw:bg-white tw:px-4 tw:pt-5 tw:pb-4 tw:text-left tw:shadow-xl tw:transition-all tw:data-closed:translate-y-4 tw:data-closed:opacity-0 tw:data-enter:duration-300 tw:data-enter:ease-out tw:data-leave:duration-200 tw:data-leave:ease-in tw:w-[95vw] tw:h-[95vh] tw:max-w-none tw:max-h-none tw:sm:p-6 tw:data-closed:sm:translate-y-0 tw:data-closed:sm:scale-95"
            >
              <div className="tw:absolute tw:top-0 tw:right-0 tw:hidden tw:pt-4 tw:pr-4 tw:sm:block">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="tw:rounded-md tw:bg-white tw:text-gray-400 tw:hover:text-gray-500 tw:focus:ring-2 tw:focus:ring-[#4F8E31] tw:focus:ring-offset-2 tw:focus:outline-hidden"
                >
                  <span className="tw:sr-only">Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="tw:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="tw:sm:flex tw:sm:items-start tw:w-full tw:h-full tw:pb-8">
                <div className="tw:mt-3 tw:text-center tw:sm:mt-0 tw:sm:text-left tw:w-full tw:h-full">
                  <DialogTitle
                    as="h3"
                    className="tw:text-base tw:font-semibold tw:text-gray-900"
                  >
                    {material.topic}
                  </DialogTitle>
                  <div className="tw:mt-2 tw:w-full tw:h-full">
                    <iframe src={material.url} width="100%" height="100%" />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
