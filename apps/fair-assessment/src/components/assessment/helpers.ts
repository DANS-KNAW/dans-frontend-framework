export type Assessment = {
  name: string;
  id: number;
  description: string;
  principles: {
    id: string;
    name: string;
    description: string;
    criteria: Criterion[];
  }[];
  assessment_type: {
    id: string;
    name: string;
  };
};

export type Test = {
  id: string;
  description: string;
  text: string;
  guidance: {
    id: string;
    type: string;
    description: string;
    API: string;
  };
  automation?: {
    api: string;
  };
}

export type Criterion = {
  id: string;
  description: string;
  imperative: string;
  metric: {
    algorithm: string;
    benchmark: {
      equal_greater_than?: number;
    };
    tests: Test[];
  };
};

export type CriterionEvaluation = {
  id: string;
  allAnswered: boolean;
  passed?: boolean; // undefined means incomplete
};

export type Totals = {
  passed: number;
  failed: number;
  total: number;
}

export type Result = {
  "@graph": {
    "@id": string;
    "@type": string;
    "prov:value": {
      "@type": string;
      "@value": string;
    };
  }[];
} 

export function evaluateCriterion(c: Criterion, answers: Record<string, string>): CriterionEvaluation {
  const tests = c.metric.tests;
  const testAnswers = tests.map(t => answers[t.id]);
  const allAnswered = testAnswers.every(v => v !== undefined);

  if (c.metric.algorithm === "sum" && typeof c.metric.benchmark.equal_greater_than === "number") {
    if (!allAnswered) return { id: c.id, allAnswered: false };
    const total = testAnswers.reduce((sum, v) => sum + parseInt(v || "0", 10), 0);
    const passed = total >= c.metric.benchmark.equal_greater_than;
    return { id: c.id, allAnswered: true, passed };
  }

  // fallback for unknown algorithms
  return { id: c.id, allAnswered, passed: undefined };
}

export function calcTotals(criteria: Criterion[], answers: Record<string, string>) {
  const counts = { passed: 0, failed: 0, total: criteria.length };

  for (const c of criteria) {
    const result = evaluateCriterion(c, answers);
    if (!result.allAnswered) continue;
    counts[result.passed ? "passed" : "failed"]++;
  }

  return counts;
}
