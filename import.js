const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const fs = require("fs");

// Load index.json file
console.log("loading index.json");
const indexData = JSON.parse(fs.readFileSync("data/index.json", "utf8"));

// create table if needed
console.log("creating table if needed");
pool
  .query(
    `CREATE TABLE IF NOT EXISTS public.marker_cluster (
    id SERIAL PRIMARY KEY,
    object_id TEXT,
    label TEXT,
    image TEXT,
    location GEOMETRY(POINT, 4326)
);`
  )
  .then(() => {
    // clean up
    console.log("cleaning up");
    return pool.query(`DELETE FROM public.marker_cluster;`);
  })
  .then(async () => {
    // Iterate over each item in indexData
    console.log(`iterating over ${indexData.length} items`);
    let total = 0;
    for (let i = 0; i < indexData.length; i++) {
      const item = indexData[i];

      // Extract the file name from the item
      const fileName = item.file;

      // Make sure the file exists
      const filePath = `data/objects/${fileName}`;
      if (!fs.existsSync(filePath)) {
        console.error(`File ${filePath} does not exist`);
        return;
      }

      // Load the corresponding JSON file
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      // Extract the informations
      const latitude =
        jsonData["isLocatedAt"][0]["schema:geo"]["schema:latitude"];
      const longitude =
        jsonData["isLocatedAt"][0]["schema:geo"]["schema:longitude"];
      const object_id = jsonData["@id"];
      const label = jsonData["rdfs:label"]["fr"][0];
      const image =
        jsonData["hasMainRepresentation"]?.[0]?.[
          "ebucore:hasRelatedResource"
        ]?.[0]?.["ebucore:locator"]?.[0];

      await new Promise((resolve, reject) => {
        pool
          .query(
            `INSERT INTO public.marker_cluster(object_id, label, image, location) VALUES ($1, $2, $3, ST_GeomFromText('Point(${longitude} ${latitude})'));`,
            [object_id, label, image]
          )
          .then(() => {
            if (total % 1000 == 0) {
              console.log(total);
            }
            total++;
            resolve();
          })
          .catch((error) => {
            console.log("error:", error);
            reject(error);
          });
      });
    }
  })
  .then(() => {
    console.log("done");
    pool.end();
  })
  .catch((error) => {
    throw error;
  });
