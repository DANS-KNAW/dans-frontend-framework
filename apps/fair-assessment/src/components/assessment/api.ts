import type { Assessment, Result } from "./helpers";

export async function fetchAssessmentList(): Promise<Assessment[] | null> {
  try {
    // Simulate an API call to a local mock file
    const res = await fetch(`/mock-data/assessments.json`);

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

export async function fetchAssessment(id: any): Promise<Assessment | null> {
  try {
    // Simulate an API call to a local mock file
    const res = await fetch(`/mock-data/assessmentDetails.json`);

    if (!res.ok) {
      const text = await res.text();
      if (text.includes("404")) return null;
      throw new Error(`Network response was not ok: ${text}`);
    }

    const result = await res.json();
    console.log(result);
    console.log(id)

    return result.find((a: Assessment) => a.assessment_type.id === id) || null;

  } catch (err) {
    console.error("Error fetching local assessment mock:", err);
    return null;
  }
}

export async function fetchAnswer(url: string, doi: string): Promise<Result | null> {
  try {
    // Simulate an API call to a local mock file
    const res = await fetch(`${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        'resource_identifier': doi,
      }),
      method: 'POST',
    });

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