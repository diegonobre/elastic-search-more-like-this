import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from '@opensearch-project/opensearch';

const host = process.env.AWS_OPENSEARCH_HOST;
const auth = `${process.env.AWS_OPENSEARCH_USER}:${process.env.AWS_OPENSEARCH_PASS}`;

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { q } = req.query;
  console.log(q);
  const client = new Client({
    node: `https://${auth}@${host}`
  });

  // Create an index with non-default settings.
  const index_name = 'books';
  const settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };

  let response = await client.indices.create({
    index: index_name,
    body: settings,
  });

  console.log('Creating index:');
  console.log(response.body);

  // Add a document to the index.
  const document = {
    title: 'The Outsider',
    author: 'Stephen King',
    year: '2018',
    genre: 'Crime fiction',
  };

  const id = '1';

  response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });

  console.log('Adding document:');
  console.log(response.body);

  // Search for the document.
  const query = {
    query: {
      match: {
        title: {
          query: 'The Outsider',
        },
      },
    },
  };

  response = await client.search({
    index: index_name,
    body: query,
  });

  console.log('Search results:');
  console.log(response.body.hits);

  // Delete the document.
  response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log('Deleting document:');
  console.log(response.body);

  // Delete the index.
  response = await client.indices.delete({
    index: index_name,
  });

  console.log('Deleting index:');
  console.log(response.body);

  return res.status(200).json(response.body);
};

export default search;
