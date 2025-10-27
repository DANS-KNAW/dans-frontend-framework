import type { Assessment } from "./helpers";

export async function fetchAssessment(): Promise<Assessment | null> {
  try {
    // Simulate an API call to a local mock file
    const res = await fetch(`/mock-data/assessment.json`);

    if (!res.ok) {
      const text = await res.text();
      if (text.includes("404")) return null;
      throw new Error(`Network response was not ok: ${text}`);
    }

    const result = await res.json();

    return result;
  } catch (err) {
    console.error("Error fetching local assessment mock:", err);
    return null;
  }
}
