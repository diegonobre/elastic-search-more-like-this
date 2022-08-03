import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req.query;
  const r = await axios.post('http://localhost:9200/books/_search?pretty', {
    "query": {
      "match_bool_prefix": {
        "title": `${query}`
      }
    }
  });
  const {
    data: { hits },
  } = r;
  return res
    .status(200)
    .json(
      hits.hits.map((hit: any) => ({
        _id: hit._id,
        ...hit._source,
      }))
    );
};

export default search;
