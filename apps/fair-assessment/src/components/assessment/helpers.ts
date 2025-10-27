export type Assessment = {
    principles: {
        id: string;
        name: string;
        description: string;
        criteria: Criterion[];
    }[];
    assessment_type: {
        name: string;
    };
};

export type Criterion = {
  id: string;
  description: string;
  imperative: string;
  metric: {
    algorithm: string;
    benchmark: {
      equal_greater_than?: number;
    };
    tests: {
      id: string;
      description: string;
      text: string;
    }[];
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
