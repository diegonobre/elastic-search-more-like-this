import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;
  const r = await axios.post(`https://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASS}@${process.env.ELASTICSEARCH_HOST}/books/_search?pretty`, {
    "size": 12,
    "query": {
      "more_like_this": {
        "fields": [
          "title",
          "subtitle",
          "authors",
          "description"
        ],
        "like": [
          {
            "_index": "books",
            "_id": id
          }
        ],
        "min_term_freq": 1,
        "max_query_terms": 24
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
