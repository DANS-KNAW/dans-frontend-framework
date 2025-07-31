type MaterialType = "PDF" | "HTML";

export interface Material {
  topic: string;
  type: MaterialType;
  url: string;
}

interface MaterialGroup {
  group: string;
  materials: Material[];
}

import { useEffect, useState } from "react";
import DocumentModel from "./document-model";

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
    <dl className="tw:mt-16 tw:space-y-12">
      {materialGroups.map((materialGroup) => (
        <div key={materialGroup.group}>
          <p className="tw:text-lg tw:font-medium tw:border-b tw:border-gray-200 tw:pb-2">
            {materialGroup.group}
          </p>
          <ul>
            {materialGroup.materials.map((material) => (
              <div key={material.topic} className="tw:mt-4">
                <DocumentModel material={material} />
              </div>
            ))}
          </ul>
        </div>
      ))}
    </dl>
  );
}
