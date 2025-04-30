type MaterialType = "PDF" | "FAQ";

export interface Material {
  topic: string;
  type: MaterialType;
  url: string;
}

interface MaterialGroup {
  group: string;
  materials: Material[];
}
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import PdfMaterial from "./pdf-material";

export default function SupportMaterials({
  supportMaterialEndpoint,
}: {
  supportMaterialEndpoint: string;
}) {
  const [materialGroups, setMaterialGroups] = useState<MaterialGroup[]>([]);

  useEffect(() => {
    const fetchMaterials = async (): Promise<void> => {
      const response = await fetch(supportMaterialEndpoint);

      if (!response.ok) {
        setMaterialGroups([]);
        return;
      }

      const materials: MaterialGroup[] = await response.json();

      if (materials.length === 0) {
        setMaterialGroups([]);
        return;
      }

      setMaterialGroups(materials);
      return;
    };

    fetchMaterials();
  }, []);

  return (
    <dl className="tw:mt-16 tw:divide-y tw:divide-gray-900/10">
      {materialGroups.map((materialGroup) => (
        <Disclosure
          key={materialGroup.group}
          as="div"
          className="tw:py-6 tw:first:pt-0 tw:last:pb-0"
        >
          <dt>
            <DisclosureButton className="tw:group tw:flex tw:w-full tw:items-start tw:justify-between tw:text-left tw:text-gray-900">
              <span className="tw:text-base/7 tw:font-semibold tw:cursor-pointer tw:hover:underline">
                {materialGroup.group}
              </span>
              <span className="tw:ml-6 tw:flex tw:h-7 tw:items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                  className="tw:size-6 tw:group-data-open:hidden"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                  className="tw:size-6 tw:group-not-data-open:hidden"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </span>
            </DisclosureButton>
          </dt>
          <DisclosurePanel as="dd" className="tw:mt-2">
            {materialGroup.materials.map((material) => (
              <div key={material.topic} className="tw:mt-4">
                <PdfMaterial material={material} />
              </div>
            ))}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </dl>
  );
}
