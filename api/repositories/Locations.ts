import { Pool, QueryResult } from "pg";

class Locations {
  private db: Pool;
  constructor(pool: Pool) {
    this.db = pool;
  }

  getPointsInsideBoundingBox(
    west: string,
    south: string,
    east: string,
    north: string
  ): Promise<QueryResult<any>> {
    return this.db.query({
      text: "SELECT id, object_id, label, image, ST_Y(location) AS y, ST_X(location) as x FROM public.marker_cluster u WHERE location && ST_MakeEnvelope($1, $2, $3, $4, 4326)",
      values: [west, south, east, north],
    });
  }
}

export { Locations };
