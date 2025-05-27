import dayjs, { getCurrentDate } from '@/utils/dayjs.js';

export const getBirthdayIdol = async () => {
  const today = getCurrentDate().format('MM-DD');
  const queryText =
    encodeURIComponent(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX schema: <http://schema.org/>
    SELECT (sample(?o) as ?date) (sample(?n) as ?name) (sample(?a) as ?age) (sample(?u) as ?IdolListURL)
    WHERE { 
      ?sub schema:birthDate ?o; imas:Brand ?b; foaf:age ?a; imas:IdolListURL ?u;
      rdfs:label ?n;
      FILTER(regex(str(?o), "${today}" ) && contains(?b, "SideM")).
    }
    group by(?n)order by(?name)`);
  const url = `https://sparql.crssnky.xyz/spql/imas/query?query=${queryText}`;

  return await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `ステータスコード${response.status}: ${response.statusText}\nURL: ${url}`
        );
      }

      return response.json();
    })
    .then((data) => {
      const result =
        data.results.bindings.length > 0
          ? data.results.bindings.map(
              ({
                name,
                age: _age,
                IdolListURL,
              }: {
                [key: string]: {
                  type: string;
                  datatype?: string;
                  value: string;
                };
              }) => {
                const age = Number(_age.value);
                const title = age < 20 ? 'くん' : 'さん';

                return {
                  name: `${name.value}${title}`,
                  url: IdolListURL.value,
                };
              }
            )
          : [];

      const names = [];
      const urls = [];
      for (const idol of result) {
        names.push(idol.name);
        urls.push(idol.url);
      }

      return names.length > 0 && {
        name: names.join('、'),
        url: urls.join(`\n`),
      };
    })
    .catch((error) => {
      console.error(error);
    });
};

export const createBirthdayNote = async () => {
  const { name, url } = await getBirthdayIdol();

	return name 
		? (`今日は${name}の誕生日です！ おめでとうございます！` + url ? `\n${url}`: '') 
		: null;
};
