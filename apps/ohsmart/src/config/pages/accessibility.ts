import type { Page } from "@dans-framework/pages";

const page: Page = {
  id: "home",
  name: "Accessibility Statement for OH-SMArt Data Deposit Application",
  slug: "/accessibility",
  template: "generic",
  inMenu: false,
  content: `
    <p>
        This is an accessibility statement from DANS-KNAW.
    </p>
    <h2>Conformance status</h2>
    <p>
        The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. OH-SMArt Data Deposit App is fully conformant with WCAG 2.1 level AA. Fully conformant means that the content fully conforms to the accessibility standard without any exceptions.
    </p>
    <h3>Technical specifications</h3>
    <p>
        Accessibility of OH-SMArt Data Deposit App relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
    </p>
    <ul>
        <li>HTML</li>
        <li>WAI-ARIA</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>
    <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
    <h2>Assessment approach</h2>
    <p>
        DANS-KNAW assessed the accessibility of OH-SMArt Data Deposit App by the following approaches:
    </p>
    <ul>
        <li>Self-evaluation</li>
    </ul>
    <h2>Date</h2>
    <p>
        This statement was created on 18 August 2025 using the <a href="https://www.w3.org/WAI/planning/statements/">W3C Accessibility Statement Generator Tool</a>.
    </p>
  `,
};

export default page;
