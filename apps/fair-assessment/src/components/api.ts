const USE_MOCK = true;

const mockPidData = {
  dataset: {
    name: 'Dataset Name',
    id: 'dataset_id',
    url: 'https://google.com',
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

export type Obj = {
  name: string;
  id: string;
  url?: string;
}
export type Pid = {
  dataset: Obj;
  repository: Obj;
  collections: Obj[];
  institutions: Obj[];
}

const PID_FETCH_BASE_URL = "https://pid-fetcher.labs.dansdemo.nl";

export async function fetchPid(pid: string): Promise<Pid> {
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

const RE3DATA_URL = "https://www.re3data.org/api/v1";

// helper to parse XML response for all repos
function parseRepositoriesXML(xmlString: string): Obj[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  const repositories = Array.from(xml.getElementsByTagName("repository"));

  // Map all repositories to their IDs and names. Has duplicates from API, no good
  // const allRepos = repositories.map(repo => ({
  //   id: repo.getElementsByTagName("id")[0]?.textContent ?? "",
  //   name: repo.getElementsByTagName("name")[0]?.textContent ?? "",
  // }));

  const uniqueRepos = Array.from(
    repositories.reduce((map, repo) => {
      const id = repo.getElementsByTagName("id")[0]?.textContent ?? "";
      const name = repo.getElementsByTagName("name")[0]?.textContent ?? "";

      if (id && !map.has(id)) {
        map.set(id, { id, name });
      }

      return map;
    }, new Map()).values()
  );

  return uniqueRepos;
}

// Fetches a full list of repositories from re3data in xml format
export async function fetchRepositories() {
    const res = await fetch(`${RE3DATA_URL}/repositories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const text = await res.text();
    return parseRepositoriesXML(text);
}

// helper for parsing xml for single repo
function parseRepositoryInfoXML(xmlString: string): SingleRepo {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  const repos = Array.from(xml.getElementsByTagNameNS("*", "repository"));

  return repos.map(repo => {
    const getTag = (tag: string) => repo.getElementsByTagNameNS("*", tag)?.[0]?.textContent?.trim() ?? "";

    const repoId = getTag("re3data.orgIdentifier");
    const repoName = getTag("repositoryName");
    const repoUrl = getTag("repositoryURL");

    const institutions = Array.from(repo.getElementsByTagNameNS("*", "institution")).map(inst => {
      const name = inst.getElementsByTagNameNS("*", "institutionName")[0]?.textContent?.trim() ?? "";

      const ids = Array.from(inst.getElementsByTagNameNS("*", "institutionIdentifier")).map(el => {
        const value = (el.textContent ?? '').trim();
        const typeMatch = value.match(/^(ROR|RRID|.*?):/);
        const type = typeMatch ? typeMatch[1] : "";
        return { type, value };
      });

      return { name, id: ids };
    });

    return { id: repoId, name: repoName, url: repoUrl, institutions };
  })[0];
}

// fetch single repo details
export type SingleRepo = {
  id: string;
  name: string;
  url: string;
  institutions: {
    name: string;
    id: {
      type: string;
      value: string;
    }[];
  }[];
}
export async function fetchRepositoryDetails(id: string): Promise<SingleRepo> {
    const res = await fetch(`${RE3DATA_URL}/repository/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const text = await res.text();
    return parseRepositoryInfoXML(text);
}