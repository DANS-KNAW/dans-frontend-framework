declare global {
  interface Window {
    _paq: any[][];
  }
}

export const initMatomo = (): void => {
  window._paq = window._paq || [];
  const _paq = window._paq;

  _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);

  const u = "https://stats.dans.knaw.nl/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "28"]);

  const d = document;
  const g = d.createElement("script");
  const s = d.getElementsByTagName("script")[0];

  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode!.insertBefore(g, s);
};

export const trackEvent = (
  category: string,
  action: string,
  name?: string,
  value?: number
): void => {
  if (window._paq) {
    window._paq.push(["trackEvent", category, action, name, value]);
  }
};
