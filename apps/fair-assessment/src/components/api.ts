const USE_MOCK = true;

const mockPidData = {
  dataset: {
    name: 'Dataset Name',
    id: 'dataset_id',
  },
  repository: {
    name: 'De Repo namee',
    id: 'repo_id'
  },
  collections: [
    {
      name: 'Collection 1',
      id: 'collection_1_id',
    },
    {
      name: 'Collection 2',
      id: 'collection_2_id',
    }
  ],
  institutions: [
    {
      name: 'Institution 1',
      id: 'institution_1_id',
      ror: 'XXX'
    },
    {
      name: 'Institution 2',
      id: 'institution_2_id',
      ror: 'YYY'
    }
  ]
};

const PID_FETCH_BASE_URL = "https://pid-fetcher.labs.dansdemo.nl/";

export async function fetchPid(pid: string) {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPidData), 300)
    );
  } else {
    const res = await fetch(`${PID_FETCH_BASE_URL}/repository-info/${pid}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  }
}