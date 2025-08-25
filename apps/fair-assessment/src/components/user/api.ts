export type Collection = {
  name: string;
  enabled: boolean;
};

export type Obj = {
  name: string;
  id: string;
  url?: string;
  oai?: string;
  institutions?: {
    name: string;
    id: {
      type: string;
      value: string;
    }[];
  }[];
  collections?: Collection[];
  repository?: never;
  identifier?: never;
  title?: never;
}

export type Pid = {
  name: string;
  id: string;
  url?: string;
  identifier: string;
  title: string;
  repository: Obj;
  collections: string[];
  institutions: Obj[];
}

export async function fetchPid(pid: string): Promise<Pid | null> {
  try {
    const res = await fetch(`${import.meta.env.VITE_PID_FETCH_BASE_URL}/repository-info/${pid}`);
    if (!res.ok) {
      const text = await res.text();
      // check if the error message contains a 404 from DataCite
      if (text.includes("404 Client Error")) return null;
      throw new Error(`Network response was not ok: ${text}`);
    }
    const result = await res.json();
    return {
      ...result,
      repository: {
        ...result.repository,
        id: result.repository['re3-id'],
      },
    };
  } catch (err) {
    console.error("Error fetching PID:", err);
    return null; // fallback for network/server errors
  }
}

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
    const res = await fetch(`${import.meta.env.VITE_PROXY_API_BASE_URL}${encodeURIComponent(`https://www.re3data.org/api/v1/repositories`)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const text = await res.json();
    return parseRepositoriesXML(text.text);
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
  collections?: Collection[];
  identifier?: never;
  title?: never;
  repository?: never;
}
export async function fetchRepositoryDetails(id: string): Promise<SingleRepo> {
    const res = await fetch(`${import.meta.env.VITE_PROXY_API_BASE_URL}${encodeURIComponent(`https://www.re3data.org/api/v1/repository/${id}`)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const text = await res.json();
    return parseRepositoryInfoXML(text.text);
}

const ROR_URL = "https://api.ror.org/v2";

export type RorResponse = {
  id: string;
  names: {
    types: string[];
    value: string;
  }[];
};

export async function fetchRor(value: string): Promise<RorResponse[]> {
  const res = await fetch(`${ROR_URL}/organizations?query=${value}*`, {
    method: 'GET',
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Network response was not ok");
  const json = await res.json();
  return json.items;
}