declare global {
  interface Window {
    _paq: any[][];
  }
}

export const initMatomo = () => {
  window._paq = window._paq || [];
  const _paq = window._paq;

  _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);

  const u = import.meta.env.VITE_MATOMO_URL;
  const p = import.meta.env.VITE_MATOMO_NAME_PHP;
  const j = import.meta.env.VITE_MATOMO_NAME_JS;
  const d = import.meta.env.VITE_MATOMO_SITE_ID;

  _paq.push(["setTrackerUrl", u + p + ".php"]);
  _paq.push(["setSiteId", d]);

  const doc = document;
  const g = doc.createElement("script");
  const s = doc.getElementsByTagName("script")[0];

  g.async = true;
  g.src = u + j + ".js";
  s.parentNode!.insertBefore(g, s);
};
