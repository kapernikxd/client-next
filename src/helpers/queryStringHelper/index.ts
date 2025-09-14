import queryString from "query-string";

type QueriedUrl = {
  url: string;
  query: any;
};

export function getQueriedUrl({ url, query }: QueriedUrl) {
  return queryString.stringifyUrl(
    { url: url, query: query },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    }
  );
}
