import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "home",
  name: "Accessibility Statement for OH-SMArt Data Deposit Application",
  slug: "/accessibility",
  template: "generic",
  inMenu: false,
  content: `
    <p>
        This is an accessibility statement from <span class="basic-information organization-name">DANS-KNAW</span>.
    </p>
    <h2>Conformance status</h2>
    <p>
        The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
        <span class="basic-information website-name">OH-SMArt Data Deposit App</span>
        is
        <span class="basic-information conformance-status" data-printfilter="lowercase">fully conformant</span>
        with
        <span class="basic-information conformance-standard"><span data-negate="">WCAG 2.1 level AA</span>.</span>
        <span>
        <span class="basic-information conformance-status">Fully conformant</span>
        means that
        <span class="basic-information conformance-meaning">the content fully conforms to the accessibility standard without any exceptions</span>.
    </span>
    </p>
    <h3>Technical specifications</h3>
    <p>
        Accessibility of
        <span class="basic-information website-name">OH-SMArt Data Deposit App</span>
        relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
    </p>
    <ul class="technical-information technologies-used">
        <li>HTML</li>
        <li>WAI-ARIA</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>
    <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
    <h2>Assessment approach</h2>
    <p>
        <span class="basic-information organization-name">DANS-KNAW</span>
        assessed the accessibility of
        <span class="basic-information website-name">OH-SMArt Data Deposit App</span>
        by the following approaches:
    </p>
    <ul class="technical-information assessment-approaches">
        <li>Self-evaluation</li>
    </ul>
    <h2>Date</h2>
    <p>
        This statement was created on
        <span class="basic-information statement-created-date">18 August 2025</span>
        using the <a href="https://www.w3.org/WAI/planning/statements/">W3C Accessibility Statement Generator Tool</a>.
    </p>
  `,
};

export default page;
