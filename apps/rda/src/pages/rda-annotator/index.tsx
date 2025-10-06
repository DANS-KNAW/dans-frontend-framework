// import { lookupLanguageString } from "@dans-framework/utils";
import annotatorLogo from "/annotator.jpeg?url";
import cromium from "/chromium.webp?url";
import "./style.css";
// import ListItem from "@mui/material/ListItem";
// import { useTranslation } from "react-i18next";

export default function RDAAnnotator() {
  const onDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://github.com/DANS-KNAW/rda-annotator/releases/download/0.105.0/rda-annotator-0.105.0-chrome.zip"; // Replace with the actual download URL
    link.download = "rda-annotator-0.105.0-chrome.zip"; // Replace with the actual file name
    link.click();
  };
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl underline decoration-rda-600">
            RDA Annotator
          </h1>
          <div className="mt-6">
            <p className="mt-6 text-base/8 text-gray-600 max-w-3xl text-pretty">
              The RDA Annotator is a browser extension that allows users to
              annotate and tag web-based resources, which contextualises and
              categorises the content. These annotations are then passed to the
              RDA Knowledge Base, where it can be accessed by other RDA
              community members.
            </p>
            <p className="mt-6 text-base/8 text-gray-600">
              (see section 3.3 of the Annotator Guidelines)
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:ml-auto lg:pt-4 lg:pl-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base/7 font-semibold text-rda-600">
                  Cite Smarter
                </h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  Why use the Annotator?
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        data-slot="icon"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-6 text-rda-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
                      Connect Research Resources.
                    </dt>
                    <dd className="inline">
                      Easily link web content to the RDA Graph and contribute to
                      a growing knowledge network.
                    </dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-6 text-rda-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 6h.008v.008H6V6Z"
                        />
                      </svg>
                      Contextual Tagging.
                    </dt>
                    <dd className="inline">
                      Add meaningful metadata using established RDA
                      vocabularies.
                    </dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2.5"
                        stroke="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-6 text-rda-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                      Improved Discoverability.
                    </dt>
                    <dd className="inline">
                      Make important research resources more findable for the
                      entire research community.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-center justify-end lg:order-first">
              <img
                width="2432"
                height="1442"
                src={annotatorLogo}
                alt="Product screenshot"
                className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                How Does It Work?
              </p>
              <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <span className="text-rda-600">1.</span>
                  <span>
                    Install the extension in your browser Install the extension
                    in your browser.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-rda-600">2.</span>
                  <span>
                    Navigate to any web page with relevant research content.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-rda-600">3.</span>
                  <span>Select text you want to annotate.</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-rda-600">4.</span>
                  <span>
                    Add context with metadata like title, date, and resource
                    type.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-rda-600">5.</span>
                  <span>
                    Tag with vocabularies to connect to RDA working groups and
                    interests.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-rda-600">6.</span>
                  <span>
                    Submit your annotation to add it to the RDA Knowledge Base.
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Getting Started
              </p>
              <div className="mt-12">
                <button onClick={onDownload} className="inline-flex flex-row items-center gap-4 rounded-lg shadow-md px-4 border border-gray-200 hover:bg-rda-100 cursor-pointer py-2">
                  <img src={cromium} alt="Cromium" className="w-12 h-12" />
                  <p>Download Chromium</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
