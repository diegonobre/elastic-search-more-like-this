import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;
  const r = await axios.post('http://localhost:9200/books/_search?pretty', {
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
            "_id": "r0V8YYIBgCKAj2lz3Mit"
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
