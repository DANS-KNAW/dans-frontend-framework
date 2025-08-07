import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Drawer({
  open,
  setOpen,
  children,
}: Readonly<{
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}>) {
  return (
    <Dialog
      open={open}
      onClose={setOpen}
      className="tw:relative tw:z-[99999999999]"
    >
      <div className="tw:fixed tw:inset-0" />

      <div className="tw:fixed tw:inset-0 tw:overflow-hidden">
        <div className="tw:absolute tw:inset-0 tw:overflow-hidden">
          <div className="tw:pointer-events-none tw:fixed tw:inset-y-0 tw:right-0 tw:flex tw:max-w-full tw:pl-10 tw:sm:pl-16">
            <DialogPanel
              transition
              className="tw:pointer-events-auto tw:w-screen tw:max-w-2xl tw:transform tw:transition tw:duration-500 tw:ease-in-out tw:data-closed:translate-x-full tw:sm:duration-700"
            >
              <div className="tw:flex tw:h-full tw:flex-col tw:overflow-y-scroll tw:bg-white tw:py-6 tw:shadow-xl">
                <div className="tw:px-4 tw:sm:px-6">
                  <div className="tw:flex tw:items-start tw:justify-between">
                    <DialogTitle className="tw:text-base tw:font-semibold tw:text-gray-900">
                      Support Materials
                    </DialogTitle>
                    <div className="tw:ml-3 tw:flex h-7 tw:items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="tw:relative tw:rounded-md tw:bg-white tw:text-gray-400 tw:hover:text-gray-500 tw:focus:ring-2 tw:focus:ring-[#4F8E31] tw:focus:ring-offset-2 tw:focus:outline-hidden"
                      >
                        <span className="tw:absolute tw:-inset-2.5" />
                        <span className="tw:sr-only">Close panel</span>
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
                  </div>
                </div>
                <div className="tw:relative tw:mt-6 tw:flex-1 tw:px-4 tw:sm:px-6">
                  {children}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
