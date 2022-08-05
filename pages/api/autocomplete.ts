import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req.query;
  const r = await axios.post(`https://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASS}@${process.env.ELASTICSEARCH_HOST}/books/_search?pretty`, {
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
