import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { GorcResponse } from "../../../types/Api";

const gorcDataElements = [
  {
    id: "6DEE3E6B",
    parent_id: undefined,
    title: "Governance",
    description:
      "Human individuals and groups comprised of stakeholders that define the commons purpose and the development of the strategies, objectives, values, and policies that frame how that purpose will be pursued.",
  },
  {
    id: "B9EA25EF",
    parent_id: undefined,
    title: "Rules of Participation & Access",
    description:
      "A set of policies defining a minimal set of rights, obligations, and accountiability governing the activities of those participating in the commons.",
  },
  {
    id: "321CA671",
    parent_id: undefined,
    title: "Sustainability",
    description:
      "Models and agreements made on how to fund or resouce activities in a way that can be sustained over the long term.",
  },
  {
    id: "D1D70F24",
    parent_id: undefined,
    title: "Engagement",
    description:
      "Methods, mechanisms, and means used to interact with the broad research commons community to involve them in activities. Specifically human engagement, as technical engagement is captured in Services* & Tools",
  },
  {
    id: "05952B0F",
    parent_id: undefined,
    title: "Human Capacity",
    description:
      "The ability of the commons* to create a human-friendly environment for all stakeholders* and community* members* in all aspects, specifically for users, Providers, and internal staff, so that the commons* can set and achieve objectives, perform functions, solve problems, and continue to develop the means and conditions required to enable this process.",
  },
  {
    id: "1510F16E",
    parent_id: undefined,
    title: "ICT Infrastructure",
    description:
      "Information and communications technology infrastructure, the physical components that a computer system requires to function and are necessary to conduct research.",
  },
  {
    id: "A5068187",
    parent_id: undefined,
    title: "Interoperability",
    description:
      "The ability of research objects* or tools* from different resources to integrate or work together with minimal effort. e.g. A research data file can be used by two different commons* HPC infrastructure.",
  },
  {
    id: "AE2C33DD",
    parent_id: undefined,
    title: "Standards",
    description:
      "A repeatable, harmonized, agreed and documented way of doing something.",
  },
  {
    id: "15056876",
    parent_id: undefined,
    title: "Services & Tools",
    description:
      "Service: Any commons element that can be invoked by users* to perform some action on their behalf.Tool: Any commons* element that enables users* to perform one or more operations, typically on data with data as the output.",
  },
  {
    id: "6FF84678",
    parent_id: undefined,
    title: "Research Object*",
    description:
      "Any input or output of any and all stages of the research process.",
  },
  // Attributes
  {
    id: "77D49FB9",
    parent_id: "6DEE3E6B",
    title: "Intent",
    description: "Commons intent, definition, and Strategic Planning",
  },
  {
    id: "9CBACF2B",
    parent_id: "6DEE3E6B",
    title: "Organization",
    description:
      "An appropriate organizational structure, design, and capability maturity for the aims and context of the commons*",
  },
  {
    id: "25D05636",
    parent_id: "6DEE3E6B",
    title: "Risk Management",
    description: "Risk management frameworks",
  },
  {
    id: "DE212E4A",
    parent_id: "6DEE3E6B",
    title: "Commons* Policy",
    description:
      "Internal Commons* Policy Development, implementation, and review",
  },
  {
    id: "1FE982A0",
    parent_id: "6DEE3E6B",
    title: "Community* Relations",
    description: "Development and implementation of community* relations",
  },
  {
    id: "441B04F2",
    parent_id: "6DEE3E6B",
    title: "Policy",
    description: "Policy advocacy, and recommendations",
  },
  {
    id: "DD1E70FF",
    parent_id: "6DEE3E6B",
    title: "Organizational Monitoring",
    description:
      "A monitoring organizational design or organizational performance system to gather qualitative and quantitative metrics",
  },
  {
    id: "7CD61AB2",
    parent_id: "6DEE3E6B",
    title: "Research Governance",
    description:
      "Research object and service governance rules, principles, and enforcement of quality.",
  },
  {
    id: "9BA1BA84",
    parent_id: "B9EA25EF",
    title: "Community* Definition",
    description: "Any definition of the commons community*",
  },
  {
    id: "69395219",
    parent_id: "B9EA25EF",
    title: "Community* Rights",
    description:
      "Existence of a set of policies defining a minimal set of rights and obligations for the commons* communty",
  },
  {
    id: "148A4642",
    parent_id: "B9EA25EF",
    title: "Community* Accountability",
    description:
      "Existence of a set of policies defining minimal accountability for the commons* communty",
  },
  {
    id: "AB848C55",
    parent_id: "B9EA25EF",
    title: "Community* EDII",
    description:
      "A commitement to equity, diversity, inclusion, and where appropriate, Indigenization (EDII), for the commons* communty",
  },
  {
    id: "61E0388A",
    parent_id: "321CA671",
    title: "Resourcing",
    description:
      "Minimal viable plan for resourcing on the medium and long term",
  },
  {
    id: "B790D527",
    parent_id: "321CA671",
    title: "Knowledge Retention",
    description:
      "Minimal viable plan for retaining knowledge accumulated by the commons* on the medium and long term",
  },
  {
    id: "4A1ACD5F",
    parent_id: "321CA671",
    title: "Research Objects",
    description:
      "Minimal viable plan for medium and long term management of research objects*",
  },
  {
    id: "9F67E5BB",
    parent_id: "321CA671",
    title: "Trust",
    description:
      "Minimal viable plan to build community* trust and maintain it in the long term",
  },
  {
    id: "ACEE4BDD",
    parent_id: "D1D70F24",
    title: "Influencing Governance",
    description:
      "Mechanisms for community* engagement and input as part of setting expectations for governance decision making processes",
  },
  {
    id: "E2C756C9",
    parent_id: "D1D70F24",
    title: "Communications",
    description:
      "Structured and coordinated communication plan and mechanism, medium, or channels",
  },
  {
    id: "4F888A7E",
    parent_id: "D1D70F24",
    title: "Events",
    description:
      "Events hosted or provided by the commons* for individuals in the commons community*.",
  },
  {
    id: "6C95143A",
    parent_id: "D1D70F24",
    title: "Training",
    description:
      "Training hosted or provided by the commons* for individuals in the commons community*.",
  },
  {
    id: "654DB461",
    parent_id: "D1D70F24",
    title: "Promotion",
    description:
      "Active promotion to intended audiences and incentivisation to participate in Commons*",
  },
  {
    id: "1B8FE29A",
    parent_id: "D1D70F24",
    title: "Other Research Commons*",
    description: "Engagement* with other research commons*",
  },
  {
    id: "850E4932",
    parent_id: "05952B0F",
    title: "Staff",
    description: "Internal Capacity (i.e. staff)",
  },
  {
    id: "0CCA84F1",
    parent_id: "05952B0F",
    title: "User-Friendliness",
    description: "Skill requirement for users*, ease of use for users*",
  },
  {
    id: "1CD9ABED",
    parent_id: "05952B0F",
    title: "RoP Providers",
    description:
      "Openness and freedom for Providers* as described in the Rules of Particiation & Access",
  },
  {
    id: "86A6A8A8",
    parent_id: "05952B0F",
    title: "Record Maintainer",
    description:
      "Record maintainer [contact person or organization for the record in a registry that describes the Repository*, the participation of the owner or maintainer of the repo* helps verify the information in the registry]",
  },
  {
    id: "B582B21D",
    parent_id: "05952B0F",
    title: "Services Skills",
    description: "Skills for planning, managing and assessing service delivery",
  },
  {
    id: "63F6D6A6",
    parent_id: "05952B0F",
    title: "Services Capacity",
    description:
      "Capacity to manage operations and Infrastructure Management Services*",
  },
  {
    id: "D08544E0",
    parent_id: "05952B0F",
    title: "Documentation",
    description:
      "Document and make public the whole process for every process where feasible, maintain a high level of transparency and documentation with stakeholders* and the community*",
  },
  {
    id: "3E807457",
    parent_id: "1510F16E",
    title: "Scalable",
    description:
      "Infrastructure is designed to scale with increasingly complex projects",
  },
  {
    id: "045EBFB1",
    parent_id: "1510F16E",
    title: "Regular Updates",
    description:
      "A review and update of ICT Infrastructure* happens on a regular basis, with specific considerations for what enables the next layer of the stack and environmental sustainability",
  },
  {
    id: "DF7A4A44",
    parent_id: "1510F16E",
    title: "Network Infrastructure",
    description: "Knowledge and management of Network infrastructure",
  },
  {
    id: "781A252E",
    parent_id: "1510F16E",
    title: "Compute Infrastructure",
    description: "Knowledge and management of Compute Infrastructure",
  },
  {
    id: "1EB3CFA7",
    parent_id: "1510F16E",
    title: "Storage Infrastructure",
    description: "Knowledge and management of Storage Infrastructure",
  },
  {
    id: "8EF56C34",
    parent_id: "1510F16E",
    title: "Infrastructure OS",
    description: "Base software (Infrastructure OS)",
  },
  {
    id: "85DF5C39",
    parent_id: "1510F16E",
    title: "AAI",
    description: "Authentication and Authorization Infrastructure (AAI)",
  },
  {
    id: "9B368066",
    parent_id: "A5068187",
    title: "Technical",
    description:
      "Mechanisms, infrastructure, and plans in place for technical interoperability* (i.e. artifact exchange)",
  },
  {
    id: "BB822F74",
    parent_id: "A5068187",
    title: "Semantic",
    description:
      "Mechanisms, infrastructure, and plans in place for semantic interoperability* (i.e. interpretation)",
  },
  {
    id: "A66E0E5F",
    parent_id: "A5068187",
    title: "Pragmatic",
    description:
      "Mechanisms, infrastructure, and plans in place for pragmatic interoperability* (i.e. agreements between organizations)",
  },
  {
    id: "79C884B4",
    parent_id: "A5068187",
    title: "Legal",
    description:
      "Mechanisms, infrastructure, and plans in place for legal interoperability*",
  },
  {
    id: "BAB36BF6",
    parent_id: "A5068187",
    title: "PIDs",
    description:
      "A proven workflow to connect multiple different research artefact types is built on a persistent identifier infrastructure designed for interoperability*",
  },
  {
    id: "1EAB24E3",
    parent_id: "AE2C33DD",
    title: "Supported Metadata",
    description:
      "Community* supported and well documented metadata* standards such that metadata* fulfills a given purpose",
  },
  {
    id: "F54630C2",
    parent_id: "AE2C33DD",
    title: "Vocabulary & Ontology",
    description: "Vocabulary and Ontology standards",
  },
  {
    id: "47B72C83",
    parent_id: "AE2C33DD",
    title: "Research Objects*",
    description: "Research object standards",
  },
  {
    id: "ECB75681",
    parent_id: "AE2C33DD",
    title: "Service Endpoint Definition",
    description:
      "Defined service endpoints between any combination of humans and machines",
  },
  {
    id: "F39FF8CA",
    parent_id: "AE2C33DD",
    title: "Authentication & Authorization",
    description: "Authentication and Authorization protocols",
  },
  {
    id: "9484F018",
    parent_id: "AE2C33DD",
    title: "PID Workflow & Definitions",
    description:
      "A workflow and standards for adding and maintaining PIDs for managed assets",
  },
  {
    id: "09CE6F2C",
    parent_id: "AE2C33DD",
    title: "Applications & Software",
    description:
      "Applications and Software standards, in addition to applicable research object* and metadata* standards",
  },
  {
    id: "1330CEBA",
    parent_id: "AE2C33DD",
    title: "Commons*-Specific",
    description:
      "Standards* and protocols for all processes, services and tools* offered by the commons*.",
  },
  {
    id: "1BA01522",
    parent_id: "AE2C33DD",
    title: "Development Process",
    description:
      "There exists a process for developing, updating and promoting standards",
  },
  {
    id: "D78BA8D0",
    parent_id: "AE2C33DD",
    title: "DMPs",
    description:
      "DMP standards, in addition to any applicable research object* and metadata* standards",
  },
  {
    id: "973BAB43",
    parent_id: "AE2C33DD",
    title: "Core types definitions",
    description:
      "Definitions of a set of core types of research objects* and services provided by the commons*.",
  },
  {
    id: "5373971C",
    parent_id: "AE2C33DD",
    title: "Availability",
    description:
      "Standards* describing the availability of post-print versions* of research objects* in institutional or thematic Open Access repos",
  },
  {
    id: "50083F53",
    parent_id: "AE2C33DD",
    title: "Access*",
    description:
      "Standards* for access to information, resources, services, and tools*",
  },
  {
    id: "E6DDF79A",
    parent_id: "AE2C33DD",
    title: "Computational Workflows",
    description:
      "Where computational workflows are used or referenced in Provenance* information, these should be captured in a standards-based way",
  },
  {
    id: "402EE822",
    parent_id: "AE2C33DD",
    title: "Collections",
    description:
      "Standards* for collections*, in addition to any applicable research object* and metadata* standards",
  },
  {
    id: "D2F21080",
    parent_id: "AE2C33DD",
    title: "Research Data Repository*",
    description: "Research data Repository*",
  },
  {
    id: "385EA3F1",
    parent_id: "15056876",
    title: "Publication & Research Documentation Repository*",
    description:
      "A publication and research documentation repository*, specifically for peer-reviewed articles, reports, and notes. (i.e. Research findings available to the wider academic community* and beyond.) that have been provided by the commons community*",
  },
  {
    id: "337B0595",
    parent_id: "15056876",
    title: "Research Software Repository*",
    description: "Research software repository*",
  },
  {
    id: "0A8D064E",
    parent_id: "15056876",
    title: "Vocabulary Repository*",
    description: "Vocabulary repository*",
  },
  {
    id: "824CEDD7",
    parent_id: "15056876",
    title: "Harvesting & Integration",
    description:
      "Harvesting, or aggregating, and integrating research objects*, metadata*, services and tools* from external repositories and commons*, including members* and providers*",
  },
  {
    id: "C0E5B005",
    parent_id: "15056876",
    title: "Cataloging & Inventory",
    description:
      "A process to inventory research objects* and services to create and add to an open, searchable commons* catelogue that will include pointers to other types of catalogues or collections* and services",
  },
  {
    id: "A5A228F7",
    parent_id: "15056876",
    title: "Service Marketplace",
    description:
      "A marketplace or API for external service Providers* to access and add their services, such that an interoperable interface is available to third party services from the perspective of users* and creates a service catelogue",
  },
  {
    id: "FEC5C206",
    parent_id: "15056876",
    title: "Data Acquisition",
    description: "digital object*, Research object, and data acquisition",
  },
  {
    id: "ED333B57",
    parent_id: "15056876",
    title: "Metadata Quality Control",
    description:
      "Provide integrity and quality control mechanisms for metadata*, including immutiability",
  },
  {
    id: "8DBFBCE2",
    parent_id: "15056876",
    title: "Research Object* Quality Control",
    description:
      "Provide integrity and quality control mechanisms for research objects*",
  },
  {
    id: "2B1CD18D",
    parent_id: "15056876",
    title: "Data Management",
    description: "digital object*, Research object, and data management",
  },
  {
    id: "D7778708",
    parent_id: "15056876",
    title: "Vocabulary Utilization",
    description: "A mechanism for utilizing vocabulary services",
  },
  {
    id: "9ACCB493",
    parent_id: "15056876",
    title: "Types Registration",
    description:
      "A system to register types of research objects*, services and tools* that may not already be present in the commons*.",
  },
  {
    id: "1DED88BE",
    parent_id: "15056876",
    title: "Harvestable Metadata",
    description:
      "Provide a harvestable metadata* service so that others can harvest metadata* hosted by the commons* that describes research objects*, services, and tools*.",
  },
  {
    id: "F267C969",
    parent_id: "15056876",
    title: "Usage Statistics",
    description:
      "expose research object* usage statistics so that they are publicly viewable on the research object* landing page, spanning access and downloads",
  },
  {
    id: "51CB11E4",
    parent_id: "15056876",
    title: "SaaS",
    description:
      "Software as a Service* (SaaS), or an applications catelogue, supported by the commons* Open Source Program Office (OSPO)",
  },
  {
    id: "87A86CAE",
    parent_id: "15056876",
    title: "PaaS",
    description:
      "Platform as a Service* (PaaS) (i.e. a space to deploy, develop and use software packages and libraries)",
  },
  {
    id: "90B18272",
    parent_id: "15056876",
    title: "Processing & Visualization",
    description: "Processing and visualization",
  },
  {
    id: "3155C127",
    parent_id: "15056876",
    title: "RDM-Dedicated",
    description:
      "Dedicated Research Data Management services and tools*, outside of training events and workshops.",
  },
  {
    id: "6FB0E27B",
    parent_id: "15056876",
    title: "Security & ID",
    description:
      "Securtiy and Identification services, Authenticaion and Authorization (AAI)",
  },
  {
    id: "A769C212",
    parent_id: "15056876",
    title: "Repository API",
    description:
      "API for automated execution of standard Repository* tasks and to interoperate with external services and tools* useful to the stakeholders*",
  },
  {
    id: "0721E445",
    parent_id: "6FF84678",
    title: "User Accessibility",
    description:
      "Considerations for the displayed, user*-facing accessibility and reusability of research objects* held by and discoverable through the research commons*.",
  },
  {
    id: "CF052F85",
    parent_id: "6FF84678",
    title: "Research Object Discovery",
    description:
      "Considerations for what research objects* are held by and discoverable through the commons*",
  },
  // Features
  {
    id: "A135A7D8",
    parent_id: "77D49FB9",
    title: "Status Quo",
    description:
      "Statement of current commons nature, mandate, and value proposition. Reference to any prior mandates and how the commons has changed over time.",
  },
  {
    id: "2C958DFC",
    parent_id: "77D49FB9",
    title: "Mission & Vision",
    description:
      "Development of mission and vision statements and making them accessible publicly",
  },
  {
    id: "B4D6CC4C",
    parent_id: "77D49FB9",
    title: "Values & Principles",
    description: "Development of values and/or guidance principles",
  },
  {
    id: "8AA822F3",
    parent_id: "77D49FB9",
    title: "Roadmaps",
    description: "Development of relevant roadmaps",
  },
  {
    id: "BB5A0286",
    parent_id: "77D49FB9",
    title: "Organizational Performance Metrics",
    description: "Development of organizational performance metrics",
  },
  {
    id: "661072D4",
    parent_id: "77D49FB9",
    title: "Strategic Review and Alignment Exercises",
    description: "Regular strategic review and alignment exercises",
  },
  {
    id: "98BF287D",
    parent_id: "9CBACF2B",
    title: "Constitution and Terms of Reference",
    description:
      "Development and regular review of constitution and terms of reference for all governance structure elements",
  },
  {
    id: "35DBA196",
    parent_id: "9CBACF2B",
    title: "Decision Making And Reporting",
    description:
      "An explicit decision making process, specifying who makes decisions in what scenarios and when and including a reporting structure and mechanism",
  },
  {
    id: "94D4941A",
    parent_id: "9CBACF2B",
    title: "Roles & Responsibilities",
    description:
      "A clear definition of roles, responsibilities, and ways of working",
  },
  {
    id: "117D8BE6",
    parent_id: "9CBACF2B",
    title: "Management Structure",
    description:
      "Management structure appropriate to the specific characteristics of the commons*",
  },
  {
    id: "117B2891",
    parent_id: "9CBACF2B",
    title: "Boards",
    description:
      "Steering groups or boards, including external advisors where possible",
  },
  {
    id: "22F62E27",
    parent_id: "9CBACF2B",
    title: "RoP, Access*, And Compliance",
    description:
      "Monitoring of Rules of Participation & Access* and compliance, reporting on the qualitative and quantitative compliance with the rules of participation",
  },
  {
    id: "E5807CA8",
    parent_id: "9CBACF2B",
    title: "Community* Representation",
    description:
      "Community* representation in the governance structure (e.g. through committees, task groups, review panels, etc.)",
  },
  {
    id: "6F5A4209",
    parent_id: "9CBACF2B",
    title: "Other Governance Structure Components",
    description: "Any other governance structure component",
  },
  {
    id: "BE532B69",
    parent_id: "25D05636",
    title: "Identification",
    description: "Identification of risks",
  },
  {
    id: "6C734888",
    parent_id: "25D05636",
    title: "Risk Management Framework",
    description: "Development of risk management frameworks",
  },
  {
    id: "C282A465",
    parent_id: "25D05636",
    title: "Risk Management Implementation",
    description:
      "Implementation and operationalization of risk management frameworks",
  },
  {
    id: "14BA7126",
    parent_id: "DE212E4A",
    title: "Resources Policies",
    description: "Development of policies and guidelines for resource matters",
  },
  {
    id: "4C3D08EF",
    parent_id: "DE212E4A",
    title: "Commons Policies",
    description:
      "Development of policies and guidelines for commons* operations",
  },
  {
    id: "373516B7",
    parent_id: "441B04F2",
    title: "Policy Maker Advocacy",
    description: "Advocacy towards policy makers and other stakeholders*",
  },
  {
    id: "3B12F29C",
    parent_id: "441B04F2",
    title: "Recommendations to the Community*",
    description: "Recommendations to the community*",
  },
  {
    id: "85F0C19C",
    parent_id: "7CD61AB2",
    title: "FAIR Principles",
    description:
      "A stated commitement to promoting, implementing, endorsing, and/or enforcing the FAIR principles.",
  },
  {
    id: "68723122",
    parent_id: "7CD61AB2",
    title: "CARE Principles",
    description:
      "A stated commitement to promoting, implementing, endorsing, and/or enforcing the CARE principles for Indigenous Data Governance*.",
  },
  {
    id: "7F47E6A0",
    parent_id: "7CD61AB2",
    title: "TRUST Principles",
    description:
      "For commons* with any digital Repository* aspects, a stated commitement to promoting, implementing, endorsing, and/or enforcing the TRUST principles for digital repositories.",
  },
  {
    id: "E7C5D46E",
    parent_id: "7CD61AB2",
    title: "Environmental Sustainability Principles",
    description:
      "A stated commitement to promoting, implementing, endorsing, and/or enforcing environmental sustainability in all aspects and actions of the commons*.",
  },
  {
    id: "4AF7D394",
    parent_id: "7CD61AB2",
    title: "Community* Rights and Obligations Review",
    description: "Review of community* rights and obligations",
  },
  {
    id: "2B3B1AA4",
    parent_id: "7CD61AB2",
    title: "Community* Rights and Obligations Accountability",
    description:
      "Review of management of community* rights and obligations through accountability measures.",
  },
  {
    id: "47A3811B",
    parent_id: "7CD61AB2",
    title: "Data Protection",
    description:
      "For repositories and services dealing with sensitive data, legal and non-legal approaches that protect against sensitive information compromise",
  },
  {
    id: "FE1011B3",
    parent_id: "69395219",
    title: "Access*",
    description: "Access policy",
  },
  {
    id: "86E6396C",
    parent_id: "69395219",
    title: "Resources",
    description: "Allocation of resources policy",
  },
  {
    id: "AE4A01BF",
    parent_id: "69395219",
    title: "Privacy",
    description: "Privacy policy",
  },
  {
    id: "40D44C1B",
    parent_id: "69395219",
    title: "Retention",
    description: "Retention policy",
  },
  {
    id: "36FEF548",
    parent_id: "69395219",
    title: "Other Policies",
    description:
      "Any other policies that address rights and obligations for all or any part of the commons community*",
  },
  {
    id: "3AF7413A",
    parent_id: "148A4642",
    title: "Acceptable Use",
    description: "Acceptable use policy",
  },
  {
    id: "D33EF4C9",
    parent_id: "148A4642",
    title: "Registration & Enforcement",
    description:
      "If individuals or entities in the commons community* are registered and identifiable, policies for misuse of the commons* (e.g. consequences)",
  },
  {
    id: "CDB63D54",
    parent_id: "148A4642",
    title: "Accountability",
    description:
      "Any other policies that address accountability for interactions with the commons*",
  },
  {
    id: "FD5EC325",
    parent_id: "AB848C55",
    title: "People-Oriented",
    description:
      "A people-oriented perspective is the standard for all commons* aspects and activities, such that all individuals' rights and well-being are the priority.",
  },
  {
    id: "24F2905D",
    parent_id: "AB848C55",
    title: "Code Of Conduct",
    description:
      "Code of Conduct applying to all individuals and entities in the commons community*",
  },
  {
    id: "782F36AC",
    parent_id: "AB848C55",
    title: "Commitment",
    description:
      "Any statement or embodiment encompassing EDII/DEI specified in public-facing documentation, events, actions, or other programming.",
  },
  {
    id: "48AB9C75",
    parent_id: "61E0388A",
    title: "Funding",
    description:
      "Minimal viable plan for a funding model sustainable on the medium and long term",
  },
  {
    id: "E4C97E24",
    parent_id: "61E0388A",
    title: "Human Resources",
    description:
      "Minimal viable plan for management of human resources on the medium and long term",
  },
  {
    id: "97FC8DEC",
    parent_id: "61E0388A",
    title: "Other Resources",
    description:
      "Minimal viable plan for management of any other types of resources on the medium and long term.",
  },
  {
    id: "7949E806",
    parent_id: "ACEE4BDD",
    title: "Feedback",
    description: "Structured Feedback",
  },
  {
    id: "8EF9960E",
    parent_id: "ACEE4BDD",
    title: "Attribution",
    description: "Attribution for contribution",
  },
  {
    id: "6057FE5F",
    parent_id: "ACEE4BDD",
    title: "Acknowledgement",
    description: "Acknowledgement of contribution",
  },
  {
    id: "C6199CFB",
    parent_id: "ACEE4BDD",
    title: "Response",
    description: "Response to how feedback was used",
  },
  {
    id: "E7F40AF6",
    parent_id: "4F888A7E",
    title: "Informative",
    description: "Informative events",
  },
  {
    id: "23349E03",
    parent_id: "4F888A7E",
    title: "Networking",
    description: "Community* building/networking events",
  },
  {
    id: "0CEF59E4",
    parent_id: "4F888A7E",
    title: "Planning",
    description: "Strategic planning events",
  },
  {
    id: "AFEE2635",
    parent_id: "4F888A7E",
    title: "Hackathons",
    description: "hackathons",
  },
  {
    id: "D0F5CDBE",
    parent_id: "6C95143A",
    title: "Training Content",
    description: "Considerations for training content",
  },
  {
    id: "AAE6A1EA",
    parent_id: "6C95143A",
    title: "Training Formats",
    description: "Considerations for training formats",
  },
  {
    id: "A8649792",
    parent_id: "654DB461",
    title: "Targeted Audience",
    description:
      "any active promotion and/or incentivazation to the targetted audience to particiate in the commons*",
  },
  {
    id: "57857440",
    parent_id: "654DB461",
    title: "Librarians",
    description:
      "Engage and work with research institution librarians and information professionals (e.g. data stewards)",
  },
  {
    id: "C4932ACC",
    parent_id: "654DB461",
    title: "Competitions & Contests",
    description: "Competitions and contests",
  },
  {
    id: "26D90AF5",
    parent_id: "654DB461",
    title: "Community*",
    description:
      "Facilitating community* and general population research engagement",
  },
  {
    id: "FBF0B9A0",
    parent_id: "654DB461",
    title: "Scholarly Communication",
    description:
      "Outreach and promotion of scholarly communication, beyond and in collaboration with a discovery service. Active interaction with commons community* to promote publication Repository*",
  },
  {
    id: "E2295D1C",
    parent_id: "654DB461",
    title: "Resolution",
    description:
      "Consultations or events for navigating conflicting laws/legal structures",
  },
  {
    id: "14A9D7C4",
    parent_id: "654DB461",
    title: "Participation & Access*",
    description:
      "Consultations or events for navigating participation and access to any and all commons* aspects",
  },
  {
    id: "08AC91DF",
    parent_id: "1B8FE29A",
    title: "Mentorship",
    description: "Mentorship",
  },
  {
    id: "95AF106B",
    parent_id: "1B8FE29A",
    title: "Alignments",
    description: "Strategic alignments.partnership",
  },
  {
    id: "0C94BC0F",
    parent_id: "850E4932",
    title: "Staffing",
    description:
      "Internal positions available or filled for all available or intended services, with specific consideration for research and statistics roles including data analysis, data science, and big data",
  },
  {
    id: "662E838C",
    parent_id: "850E4932",
    title: "Staff training",
    description: "Training for staff",
  },
  {
    id: "33A8E058",
    parent_id: "850E4932",
    title: "Succession",
    description: "Succession plans and labour turnover are managed effectively",
  },
  {
    id: "2A1FE38F",
    parent_id: "850E4932",
    title: "EDII Commitment",
    description:
      "A stated commitment to equity, diversity, inclusion (and indigenization, where applicable) for staff and the commons community*",
  },
  {
    id: "B40ABD23",
    parent_id: "850E4932",
    title: "Transparency & Documentation",
    description:
      "Document and share the whole process for every process, maintain a high level of transparency and documentation",
  },
  {
    id: "C4A36353",
    parent_id: "0CCA84F1",
    title: "Ease-of-Use",
    description:
      "Documentation for easing skill requirement for users* and improving ease of use such that using the commons* is an effective choice for end users*",
  },
  {
    id: "09EE036D",
    parent_id: "0CCA84F1",
    title: "Disciplinary Coverage",
    description: "The research commons* states its disciplinary coverage",
  },
  {
    id: "DBE967B1",
    parent_id: "0CCA84F1",
    title: "Accessibility Showcase",
    description: "showcase research object*, service & tool* accessibility",
  },
  {
    id: "3E1CF790",
    parent_id: "0CCA84F1",
    title: "User*-Centered Design",
    description:
      "A user*-centred design is implemented across all commons* aspects",
  },
  {
    id: "DF6213B4",
    parent_id: "1CD9ABED",
    title: "Flexible Access* Control",
    description:
      "Allow research object*, services & tools* Providers* to choose the level of access to their research objects*, services & tools*",
  },
  {
    id: "E271AE89",
    parent_id: "1CD9ABED",
    title: "Seamless Ingestion",
    description:
      "Easy to use ingest process with few barriers to participation",
  },
  {
    id: "7551039A",
    parent_id: "1CD9ABED",
    title: "Special Collection Views",
    description:
      "Allow the creation of special collection* views or digital exhibitions",
  },
  {
    id: "582A5828",
    parent_id: "1CD9ABED",
    title: "Single and Batch Ingest",
    description: "Provide both single and batch ingest paths",
  },
  {
    id: "79D2C50B",
    parent_id: "B582B21D",
    title: "Use Case Development",
    description: "Development of use cases for services and platforms",
  },
  {
    id: "A7724E34",
    parent_id: "B582B21D",
    title: "User* Needs Prioritization",
    description:
      "Prioritization of identified needs and derived requirements of users*",
  },
  {
    id: "D426E90D",
    parent_id: "B582B21D",
    title: "Plan Assessment",
    description: "Assessing plans and deployments",
  },
  {
    id: "DEE0DADA",
    parent_id: "B582B21D",
    title: "Continuous Improvement",
    description: "Implementation of continuous improvement mechanism",
  },
  {
    id: "60EABB61",
    parent_id: "DF7A4A44",
    title: "Internal",
    description: "Internal network infrastructure",
  },
  {
    id: "E849E947",
    parent_id: "DF7A4A44",
    title: "External",
    description: "External network infrastructure",
  },
  {
    id: "661DF9A4",
    parent_id: "781A252E",
    title: "Base Computing",
    description: "Base Computing Infrastructure",
  },
  {
    id: "BD4C16A2",
    parent_id: "781A252E",
    title: "Add on Computing",
    description: "Add on Computing Infrastructure",
  },
  {
    id: "698C1BA0",
    parent_id: "1EB3CFA7",
    title: "DAS",
    description:
      "Direct-attached storage, maintained and provided by the commons*, that supports different information containers as appropriate.",
  },
  {
    id: "5CCAD55B",
    parent_id: "1EB3CFA7",
    title: "NAS",
    description:
      "Network-based storage,  that supports different information containers as appropriate.",
  },
  {
    id: "98C9FE20",
    parent_id: "1EB3CFA7",
    title: "Storage Management",
    description: "Storage management infrastructure",
  },
  {
    id: "3A3A97E8",
    parent_id: "1EB3CFA7",
    title: "Policy-Based Storage",
    description: "Policy-based storage infrastructure",
  },
  {
    id: "14A10B67",
    parent_id: "8EF56C34",
    title: "Automation",
    description:
      "Infrastructure deployment and computer resource provisioning can be automated",
  },
  {
    id: "B390376F",
    parent_id: "8EF56C34",
    title: "Maintenance",
    description: "Regular maintenaince to base software and applications",
  },
  {
    id: "8DBE2C33",
    parent_id: "8EF56C34",
    title: "Version* Control",
    description:
      "Infrastructure configurations are managed in version* control",
  },
  {
    id: "7A040956",
    parent_id: "8EF56C34",
    title: "Pipelines",
    description:
      "Infrastructure configurations are performed through code and data pipelines",
  },
  {
    id: "770C1E76",
    parent_id: "85DF5C39",
    title: "Base AAI",
    description: "Base AAI infrastructure",
  },
  {
    id: "87EC5798",
    parent_id: "85DF5C39",
    title: "Federated AAI",
    description:
      "When possible, federated Authentication and Authorization infrastructure",
  },
  {
    id: "3885FD85",
    parent_id: "85DF5C39",
    title: "Add on AAI",
    description: "Add on AAI infrastructure",
  },
  {
    id: "F1FA3086",
    parent_id: "9B368066",
    title: "Technical Capability",
    description:
      "Any mechanisms, infrastructure, or plans for technical interoperability*",
  },
  {
    id: "ECC81605",
    parent_id: "9B368066",
    title: "Syntactic APIs",
    description: "APIS that support Syntactic interoperability*",
  },
  {
    id: "875EC302",
    parent_id: "9B368066",
    title: "Syntactic Formats",
    description: "File/data formats that support Syntactic interoperability*",
  },
  {
    id: "49725623",
    parent_id: "9B368066",
    title: "Syntactic Sustainability",
    description:
      "Mechanisms exist to maintain interoperability* and compatibility at the syntactic level over time",
  },
  {
    id: "2A0EB744",
    parent_id: "9B368066",
    title: "Shared Security Framework",
    description:
      "A security framework is shared between services and tools*, from backend to frontend.",
  },
  {
    id: "EFD0EED6",
    parent_id: "BB822F74",
    title: "Semantic Capability",
    description:
      "Any mechanisms, infrastructure, or plans for semantic interoperability*",
  },
  {
    id: "21BC3E87",
    parent_id: "BB822F74",
    title: "Vocabularies (Meta)Data",
    description:
      "Metadata*, data, and other research objects* use standardized community*-endorsed vocabularies, and FAIR-compliant community*-endorsed vocabularies where possible.",
  },
  {
    id: "ED74FAC9",
    parent_id: "BB822F74",
    title: "Vocabularies APIs",
    description:
      "Follow API search standards and community* adopted vocabularies for interoperability*",
  },
  {
    id: "7077C640",
    parent_id: "A66E0E5F",
    title: "Pragmatic Capability",
    description:
      "Any mechanisms, infrastructure, or plans for pragmatic interoperability*",
  },
  {
    id: "24B03F59",
    parent_id: "A66E0E5F",
    title: "Domain Agnostic",
    description:
      "For non-domain specific commons*, domain-specific needs are addressed and considered so that the commons* is interoperable with other domain-specific commons* and services, including both provision of specific services and tools* as well as a mechanism to allow for user* or Provider*-given domain-specific extensions",
  },
  {
    id: "9A728994",
    parent_id: "79C884B4",
    title: "Open Licensing",
    description:
      "Access to and reuse of research objects* is open and unrestricted as a default rule, or otherwise granted with the fewest limitations possible such that by default, intellectual property rights are waived as far as possible and the objects distributed/made accessible in the least restrictive manner",
  },
  {
    id: "7884582B",
    parent_id: "79C884B4",
    title: "Licensing Reuse",
    description:
      "A licence for reuse is required for all research objects* and tools* in the commons*",
  },
  {
    id: "125D6F97",
    parent_id: "79C884B4",
    title: "Licensing Waivers",
    description:
      "Where applicable, the CC0 or PDDL waivers of rights are the default or preferred legal tools*, followed by CC-BY 4.0 licensing. Other licenses are used as appropriate for sensitive and personal data, and are applicable across research objects*, services, and tools*.",
  },
  {
    id: "4FC6E6CD",
    parent_id: "79C884B4",
    title: "Licensing Documentation",
    description:
      "Who or what entities with rights to research objects* are is/are specified appropriately via licenses and research object* documentation and identified before dissemination.",
  },
  {
    id: "F491EFB0",
    parent_id: "79C884B4",
    title: "Licensing Electronic Statements",
    description:
      "Machines use as far as possible standardized electronic statements regarding the legal rights retained (if any) by the rights holders and Providers* of research objects* and services",
  },
  {
    id: "85419753",
    parent_id: "1EAB24E3",
    title: "Metadata* Content",
    description: "Metadata* content",
  },
  {
    id: "43D9E950",
    parent_id: "1EAB24E3",
    title: "Metadata* Format",
    description: "Metadata* format",
  },
  {
    id: "6FAE0BFE",
    parent_id: "1EAB24E3",
    title: "Metadata* Access* Method",
    description: "Metadata* access method",
  },
  {
    id: "FE86AB99",
    parent_id: "F54630C2",
    title: "Crosswalk Development",
    description:
      "The commons* develops, provides, and iteratively revises crosswalks that map the schemas that describe research objects* to standard markup vocabularies",
  },
  {
    id: "F1DB0744",
    parent_id: "F54630C2",
    title: "Variables Descriptions",
    description:
      "Variables/column titles/file elements are described in both human and machine actionable formats",
  },
  {
    id: "20D697C0",
    parent_id: "F54630C2",
    title: "Data Reuse Enablement",
    description:
      "The variables description should enable data reuse with minimum reliance on externally held free-text documentation",
  },
  {
    id: "AA496A38",
    parent_id: "F54630C2",
    title: "Decomposition Approach",
    description:
      "Where possible, the translation from human-readable to machine-actionable form follows a decomposition approach that is compatible with the classes and relations defined in the I-ADOPT ontology (https://w3id.org/iadopt/).",
  },
  {
    id: "B5AC1A89",
    parent_id: "F54630C2",
    title: "Terminology Reuse",
    description:
      "Where possible, for each of the identified components, users* are encouraged to reuse terminologies that are already aligned with the I-ADOPT Framework by either reusing existing concepts or extending collections*, or by creating new concepts based on the I-ADOPT Framework",
  },
  {
    id: "6764D161",
    parent_id: "F54630C2",
    title: "I-ADOPT Mapping",
    description:
      "Where possible, for variables based on a different schema, a mapping to the I-ADOPT Framework is provided.",
  },
  {
    id: "178FE91D",
    parent_id: "F54630C2",
    title: "Other Standards",
    description:
      "Any other standards, including domain-specific standards, for vocabularies and ontologies",
  },
  {
    id: "1364F1D6",
    parent_id: "47B72C83",
    title: "Object* Contents",
    description: "Resaerch Object Content",
  },
  {
    id: "5523BD2E",
    parent_id: "47B72C83",
    title: "Object* Formats",
    description: "Research Object* Format",
  },
  {
    id: "C621FF57",
    parent_id: "47B72C83",
    title: "Object* Access* Methods",
    description: "Research Object* Access Method",
  },
  {
    id: "9CC9FD8B",
    parent_id: "F39FF8CA",
    title: "Research Object* A&A",
    description:
      "Research object Authorization and Authentication, ability to implement authentication and authorization in its resolution protocol as part of the access process",
  },
  {
    id: "94F7B541",
    parent_id: "F39FF8CA",
    title: "Metadata* A&A",
    description:
      "Metadata* Authorization and Authentication, ability to implement authentication and authorization in its resolution protocol",
  },
  {
    id: "A69A0B39",
    parent_id: "F39FF8CA",
    title: "Data Breach Response Plan",
    description: "A response plan for detected data breaches.",
  },
  {
    id: "E677D401",
    parent_id: "9484F018",
    title: "Persistent PID Management",
    description:
      "The ability to manage complex life cycles without deletion of PIDs including for dynamic digital objects*.",
  },
  {
    id: "41002484",
    parent_id: "9484F018",
    title: "Standard Usage",
    description:
      "A widely used and documented PID standard / services is used for assigning PID",
  },
  {
    id: "6A662850",
    parent_id: "9484F018",
    title: "Collection* Association",
    description:
      "PIDs may be associated with collections* which can consist of a number of research objects* (i.e. PIDs are assigned to research compendium*s)",
  },
  {
    id: "96E31554",
    parent_id: "9484F018",
    title: "Version*-Specific",
    description:
      "Different versions* of research objects* are assigned distinct identifiers",
  },
  {
    id: "9B856FDC",
    parent_id: "9484F018",
    title: "Data Type Assignment",
    description:
      "PIDs are assigned to data types, resolving to human and machine accessible internal or external data type standards. If internal, data types follow the metadata* and data format requirements applied to research objects*",
  },
  {
    id: "1D192513",
    parent_id: "9484F018",
    title: "Related Identifiers",
    description:
      'Manage replicas of research objects* and research objects* merged, split, replicated or derived from other research ("master") objects',
  },
  {
    id: "B15DAE61",
    parent_id: "09CE6F2C",
    title: "Reusable",
    description: "Software and applications are designed for reusability",
  },
  {
    id: "A398F805",
    parent_id: "09CE6F2C",
    title: "Permissive License",
    description:
      "Software is released under a permissive licence that has broad acceptance in the community*",
  },
  {
    id: "C999C8BC",
    parent_id: "09CE6F2C",
    title: "Test Suites",
    description:
      "Test suites are included for each application and software package, i.e. the presence and quality of automated tests and the versions* of coding languages those tests are run against",
  },
  {
    id: "146A59AA",
    parent_id: "09CE6F2C",
    title: "Reproducible",
    description:
      "Applications and software have a demonstrated, reproducible build procedure",
  },
  {
    id: "8C2378BE",
    parent_id: "D78BA8D0",
    title: "DMP Contents",
    description: "DMP content",
  },
  {
    id: "72261E67",
    parent_id: "D78BA8D0",
    title: "DMP Formats",
    description: "DMP format",
  },
  {
    id: "B001EEB9",
    parent_id: "D78BA8D0",
    title: "DMP Access* Methods",
    description: "DMP access method",
  },
  {
    id: "991399F9",
    parent_id: "50083F53",
    title: "Accessibility",
    description:
      "Commons* repositories, platforms, services, and tools* shall comply with local and international standards for accessibility for all electronic and information technology to people with disabilities.",
  },
  {
    id: "3270B490",
    parent_id: "50083F53",
    title: "Non-Discriminatory",
    description:
      "Commons* repositories, platforms, services, and tools* shall comply with a principle of non-discriminatory access so that all users*, Providers*, staff, and other stakeholders* are treated equally. Any variation in accessibility will result solely from the capability, equipment, and connectivity of the individual.",
  },
  {
    id: "C3E55398",
    parent_id: "402EE822",
    title: "Non-Recursive Sub-collections*",
    description:
      "collections* may contain sub-collections*, but not recursively. It should be possible to restrict this rule for individual collections*.",
  },
  {
    id: "3AE9A4CA",
    parent_id: "402EE822",
    title: "Multiple Membership",
    description: "Objects may belong to more than one collection*",
  },
  {
    id: "76FDF5FB",
    parent_id: "402EE822",
    title: "Distributed Objects",
    description:
      "A single collection* may contain objects stored at, and sourced from, different places",
  },
  {
    id: "17360BF9",
    parent_id: "402EE822",
    title: "Actionable",
    description:
      "collections* must offer well-defined actions (such as create, read, update, delete) that can be executed by software agents with minimal additional context required.",
  },
  {
    id: "0641A673",
    parent_id: "402EE822",
    title: "Role Tracking",
    description:
      "If possible, record the role of an object within a specific collection*, independent from the role it has in the context of other collections*.",
  },
  {
    id: "4F48462A",
    parent_id: "402EE822",
    title: "Item ordering",
    description:
      "It is stated, in metadata* or otherwise, whether or not member items have an implicit ordering",
  },
  {
    id: "A9073F5E",
    parent_id: "402EE822",
    title: "New Item Insertion Position",
    description:
      "If ordered, it is stated, in metadata* or otherwise, where new items are inserted in that order",
  },
  {
    id: "FAE07090",
    parent_id: "402EE822",
    title: "Item Role Assignment",
    description:
      "It is stated, in metadata* or otherwise, whether member items can assume specific roles with respect to the collection* (e.g. such as becoming a 'default' item)",
  },
  {
    id: "F1001AD9",
    parent_id: "402EE822",
    title: "Static/Mutable Items",
    description:
      "It is stated, in metadata* or otherwise, whether collection* membership is static or mutable",
  },
  {
    id: "8813FC55",
    parent_id: "402EE822",
    title: "Static/Mutable Metadata*",
    description:
      "It is stated, in metadata* or otherwise, whether collection* metadata* is static or mutable",
  },
  {
    id: "632465A2",
    parent_id: "402EE822",
    title: "(un)Restricted Data Types",
    description:
      "It is stated, in metadata* or otherwise, whether member items are restricted to a specific data type",
  },
  {
    id: "5AF93D41",
    parent_id: "402EE822",
    title: "Item Limits",
    description:
      "It is stated, in metadata* or otherwise, whether a maximum number of a members* items is imposed",
  },
  {
    id: "001D2DBB",
    parent_id: "385EA3F1",
    title: "Provider* contribution assistance",
    description:
      "Services* that assist Providers* in contributing to the publication repo",
  },
  {
    id: "C9354656",
    parent_id: "385EA3F1",
    title: "Scholarly Communications Discovery",
    description: "Discovery",
  },
  {
    id: "4B849F69",
    parent_id: "385EA3F1",
    title: "Publication",
    description: "Publication",
  },
  {
    id: "313BA3EC",
    parent_id: "FEC5C206",
    title: "Registration",
    description: "Registration",
  },
  {
    id: "19E82633",
    parent_id: "FEC5C206",
    title: "Persistent Identifier",
    description: "Persistent Identifier",
  },
  {
    id: "61F4CF4F",
    parent_id: "FEC5C206",
    title:
      "Identify what resources and research objects* are to be marked up with structured metadata*",
    description:
      "Identify what resources and research objects* are to be marked up with structured metadata*",
  },
  {
    id: "53FF64C5",
    parent_id: "FEC5C206",
    title: "Publishing",
    description: "Publishing",
  },
  {
    id: "5D7969F5",
    parent_id: "FEC5C206",
    title: "Annotation",
    description: "Annotation",
  },
  {
    id: "5D4638BE",
    parent_id: "FEC5C206",
    title: "Digitization",
    description:
      "Digitization. 2D / 3D, offered directly by the commons* or offered through a 3rd party",
  },
  {
    id: "35DD9441",
    parent_id: "FEC5C206",
    title: "Staged Content Support",
    description:
      "Support staged content, such as submission states that are raw, processed, curated, and published,",
  },
  {
    id: "C4573B7C",
    parent_id: "ED333B57",
    title: "Technical",
    description: "Technical",
  },
  {
    id: "66E8F971",
    parent_id: "ED333B57",
    title: "Completeness",
    description: "Completeness",
  },
  {
    id: "E747795E",
    parent_id: "ED333B57",
    title: "Content quality",
    description: "Content quality",
  },
  {
    id: "884D5BF6",
    parent_id: "8DBFBCE2",
    title: "QA/QC Implementations",
    description:
      "QA/QC can be implemented with several methods or mechanisms, including assessment of publications, research data, and research software",
  },
  {
    id: "CD1B4EB6",
    parent_id: "8DBFBCE2",
    title: "Technical Quality Criteria",
    description:
      "Formal criteria are applied to ensure technical quality of research objects*, conducted internally by the commons*. Could be automatic.",
  },
  {
    id: "7AB6BEB6",
    parent_id: "8DBFBCE2",
    title: "External Content Review",
    description:
      "A review is conducted to ensure content quality of the research object*, conducted externally by expert reviewers",
  },
  {
    id: "5A779EB5",
    parent_id: "2B1CD18D",
    title: "Data Access*",
    description:
      "Access (i.e.  Access type (physical, virtual, remote, ...) and access mode (free, free conditional, paid, ...)).",
  },
  {
    id: "942D7AEA",
    parent_id: "2B1CD18D",
    title: "Transfer",
    description: "Transfer",
  },
  {
    id: "6A31DC38",
    parent_id: "2B1CD18D",
    title: "Interlinking",
    description: "Interlinking",
  },
  {
    id: "AEF3D588",
    parent_id: "2B1CD18D",
    title: "Data Discovery",
    description: "Discovery",
  },
  {
    id: "159493A2",
    parent_id: "2B1CD18D",
    title: "Anonymisation",
    description: "Anonymisation where necessary",
  },
  {
    id: "0E8DECB4",
    parent_id: "2B1CD18D",
    title: "Preservation",
    description: "Preservation",
  },
  {
    id: "73556D45",
    parent_id: "2B1CD18D",
    title: "Brokering",
    description: "Brokering",
  },
  {
    id: "9A3C0A6F",
    parent_id: "2B1CD18D",
    title: "Object Lifecycle Management",
    description:
      "Creation, maintenaince and curation of digital objects* and their versions*",
  },
  {
    id: "5294DA6D",
    parent_id: "2B1CD18D",
    title: "Metadata* Deduplication",
    description:
      "Identify and aggregate metadata* records that describe the same research object*",
  },
  {
    id: "101CB914",
    parent_id: "2B1CD18D",
    title: "Audit Trail Recording",
    description: "Record audit trails",
  },
  {
    id: "780EE1DC",
    parent_id: "2B1CD18D",
    title: "Asynchronous Updates",
    description: "Support asynchronous updates of research objects*",
  },
  {
    id: "41AD2631",
    parent_id: "2B1CD18D",
    title: "Ownership Transfer",
    description: "Ability to transfer ownership of a digital object*.",
  },
  {
    id: "DA27BF15",
    parent_id: "2B1CD18D",
    title: "Customizable Object Policies",
    description: "Ability to set individualized policies on research objects*",
  },
  {
    id: "A6B3AA53",
    parent_id: "2B1CD18D",
    title: "Automated Dissemination Policies",
    description: "Robust automation of policies on dissemination criteria",
  },
  {
    id: "6BF64A78",
    parent_id: "2B1CD18D",
    title: "Software/App Update Management",
    description:
      "Software and applications may be updated by the author/Provider* (e.g. commits), or are provided via an extermal platform that allows this functionality",
  },
  {
    id: "38098DB0",
    parent_id: "2B1CD18D",
    title: "Collections* Management",
    description:
      "collections* management services in addition to research object* management services",
  },
  {
    id: "931959DA",
    parent_id: "2B1CD18D",
    title: "Other Management Services*",
    description:
      "Any other relevant research object* managment service, such as those outlined in OAIS",
  },
  {
    id: "7D765467",
    parent_id: "51CB11E4",
    title: "Software Package",
    description: "Software Package",
  },
  {
    id: "3744937D",
    parent_id: "51CB11E4",
    title: "Communication",
    description: "Communication",
  },
  {
    id: "8A203122",
    parent_id: "51CB11E4",
    title: "Collaboration",
    description: "Collaboration",
  },
  {
    id: "F84461A0",
    parent_id: "51CB11E4",
    title: "Productivity",
    description: "Productivity",
  },
  {
    id: "9F3A6A85",
    parent_id: "51CB11E4",
    title: "Business",
    description: "Business",
  },
  {
    id: "F6FFFEFF",
    parent_id: "51CB11E4",
    title: "Education",
    description: "Education",
  },
  {
    id: "BDD3C980",
    parent_id: "51CB11E4",
    title: "Social/Networking",
    description: "Social/Networking",
  },
  {
    id: "6AFBCE24",
    parent_id: "51CB11E4",
    title: "Utilities",
    description: "Utilities",
  },
  {
    id: "5434669F",
    parent_id: "87A86CAE",
    title: "Development Tools*",
    description: "Developer Tools*",
  },
  {
    id: "174D6F40",
    parent_id: "87A86CAE",
    title: "SDKs",
    description: "Software Developement Kits",
  },
  {
    id: "BA5B6715",
    parent_id: "87A86CAE",
    title: "Libraries",
    description: "Software Libraries",
  },
  {
    id: "6B164B67",
    parent_id: "87A86CAE",
    title: "API Repository*/Gateway",
    description: "APIs Repository*/ Gateway",
  },
  {
    id: "81227FBB",
    parent_id: "87A86CAE",
    title: "Training Platform/Tools*",
    description: "Training platform and tools*",
  },
  {
    id: "79B08285",
    parent_id: "90B18272",
    title: "Processing & Visualization",
    description: "Any processing and visualization services",
  },
  {
    id: "E99650AC",
    parent_id: "90B18272",
    title: "Workflow",
    description: "Workflows",
  },
  {
    id: "F9057B6F",
    parent_id: "90B18272",
    title: "Parsing & Atomizing",
    description: "Parsing and atomizing research objects*",
  },
  {
    id: "BB6FEF83",
    parent_id: "90B18272",
    title: "Collaborative Platform",
    description: "A collaborative platform with AAI for groups",
  },
  {
    id: "88447BB3",
    parent_id: "6FB0E27B",
    title: "Cybersecurity",
    description: "cyber security",
  },
  {
    id: "438D317E",
    parent_id: "6FB0E27B",
    title: "User* Authentication",
    description:
      "User* authentication (i.e. of each user*), including remote access management",
  },
  {
    id: "C9A308D9",
    parent_id: "6FB0E27B",
    title: "Identity Management",
    description: "Identity access and management",
  },
  {
    id: "7B0A8A3F",
    parent_id: "6FB0E27B",
    title: "Access* Rights Management",
    description:
      "Provide different access rights for groups and users* (roles) on research objects*, their versions*, and services, and allow the import of such concepts",
  },
  {
    id: "6E37FD1B",
    parent_id: "6FB0E27B",
    title: "Identity Verification",
    description: "Assess identity verification and assign levels of assurance",
  },
  {
    id: "C051D3DF",
    parent_id: "6FB0E27B",
    title: "Certification Authority",
    description: "Certification Authority",
  },
  {
    id: "317BF58E",
    parent_id: "6FB0E27B",
    title: "Single Sign-on",
    description: "Single Sign-on",
  },
  {
    id: "14E7D908",
    parent_id: "6FB0E27B",
    title: "Group Management",
    description: "Group Creation and Management",
  },
  {
    id: "705DACBC",
    parent_id: "CF052F85",
    title: "Publications and Research Documentation",
    description: "Publications and Research Documentation",
  },
  {
    id: "9FAB1A6A",
    parent_id: "CF052F85",
    title: "Research Data",
    description: "Research Data",
  },
  {
    id: "AFD6E0C0",
    parent_id: "CF052F85",
    title: "Research Software",
    description: "Research Software",
  },
  {
    id: "B65111D3",
    parent_id: "CF052F85",
    title: "Semantic Objects",
    description: "Semantic Objects",
  },
  {
    id: "56213D31",
    parent_id: "CF052F85",
    title: "Collections*",
    description: "Collections*",
  },
];

export const gorcApi = createApi({
  reducerPath: "gorc",
  baseQuery: (args) => {
    const { content } = args;

    const filteredItems = gorcDataElements.filter((item) =>
      item.title.toLowerCase().startsWith(content.toLowerCase()),
    );

    /**
     * We check if the item has a parent and take the title of the parent.
     * We keep doing this until we reach the top level.
     */
    filteredItems.forEach((item) => {
      if (!item.parent_id) {
        return;
      }

      let hierarchy: string[] = [];

      let parent = gorcDataElements.find(
        (parent) => parent.id === item.parent_id,
      );

      if (!parent) {
        return;
      }

      hierarchy.push(parent.title);

      while (parent && parent.parent_id) {
        parent = gorcDataElements.find(
          (element) => element.id === parent!.parent_id,
        );

        if (!parent) {
          break;
        }

        hierarchy.push(parent.title);
      }

      item.parent_id = hierarchy.reverse().join(" > ");
    });

    return {
      data: {
        number_of_results: filteredItems.length,
        items: filteredItems,
      },
    };
  },
  endpoints: (build) => ({
    fetchGorc: build.query({
      query: (content) => ({ content }),
      transformResponse: (response: GorcResponse, _meta, arg) => {
        // Return an empty array when no results, which is what the Autocomplete field expects
        return response.number_of_results > 0
          ? {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.title,
                value: item.id,
                extraLabel: "description",
                extraContent: item.description,
                idLabel: "GORC ID",
                id: item.id,
                categoryLabel: "Hierarchy",
                categoryContent: item.parent_id,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchGorcQuery } = gorcApi;
