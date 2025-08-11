"use client";

import "../dist/style.css";
import { useState } from "react";
import Drawer from "./drawer";
import SupportMaterials from "./support-materials";

export default function SupportDrawer({
  supportMaterialEndpoint,
}: {
  supportMaterialEndpoint: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="tw:fixed tw:bottom-20 tw:right-6 tw:bg-[#4F8E31] tw:text-white tw:p-1.5 tw:rounded-full tw:border-2 tw:border-[#4F8E31] tw:flex tw:items-center tw:cursor-pointer tw:hover:bg-[#69BE41]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="tw:size-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
        <span className="tw:text-sm tw:font-medium tw:ml-1">Support</span>
      </button>
      
      <Drawer open={open} setOpen={setOpen}>
        <SupportMaterials supportMaterialEndpoint={supportMaterialEndpoint} />
      </Drawer>
    </>
  );
}
