export type LinkTarget = {
  href: URL;
  type?: string;
  title?: string;
};

export type ServiceDescLinkRelation = {
  id: "service-desc";
  targets: LinkTarget[];
};

export type ServiceDocLinkRelation = {
  id: "service-doc";
  targets: LinkTarget[];
};

export type ServiceMetaLinkRelation = {
  id: "service-meta";
  targets: LinkTarget[];
};

export type LinkContext = {
  anchor: URL;
  serviceDescLinkRelation?: ServiceDescLinkRelation;
  serviceDocLinkRelation?: ServiceDocLinkRelation;
  serviceMetaLinkRelation?: ServiceMetaLinkRelation;
};

export type LinkSet = {
  contexts: LinkContext[];
};

export type LinkRelationId = "service-desc" | "service-doc" | "service-meta";

export type LinkTargetDraft = {
  href: string;
  type: string;
  title: string;
};

export type LinkRelationDraft = {
  id: LinkRelationId;
  targets: LinkTargetDraft[];
};

export type LinkContextDraft = {
  anchor: string;
  serviceDescLinkRelation?: LinkRelationDraft;
  serviceDocLinkRelation?: LinkRelationDraft;
  serviceMetaLinkRelation?: LinkRelationDraft;
};

export type LinkSetDraft = {
  contexts: LinkContextDraft[];
};

export type LinkContextRelationKey = keyof Omit<LinkContextDraft, "anchor">;

export type ExchangeableLink = {
  href: string;
  type?: string;
  title?: string;
};

export type ExchangeableLinkContext = {
  anchor: string;
  "service-desc"?: ExchangeableLink[];
  "service-doc"?: ExchangeableLink[];
  "service-meta"?: ExchangeableLink[];
};

export type ExchangeableLinkSet = {
  linkset: ExchangeableLinkContext[];
};

export type RelationConfig = {
  key: LinkContextRelationKey;
  id: LinkRelationId;
  label: string;
  helpText: string;
};

export const RELATION_CONFIG: RelationConfig[] = [
  {
    key: "serviceDescLinkRelation",
    id: "service-desc",
    label: "Description",
    helpText: "Provide a machine-readable description of the service",
  },
  {
    key: "serviceDocLinkRelation",
    id: "service-doc",
    label: "Documentation",
    helpText: "Provide human-readable information about the service's documentation",
  },
  {
    key: "serviceMetaLinkRelation",
    id: "service-meta",
    label: "Metadata",
    helpText: "Provide further information about the service",
  },
];

export const createEmptyTarget = (): LinkTargetDraft => ({
  href: "",
  type: "",
  title: "",
});

export const createRelation = (id: LinkRelationId): LinkRelationDraft => ({
  id,
  targets: [createEmptyTarget()],
});

export const createEmptyContext = (): LinkContextDraft => ({
  anchor: "",
});
