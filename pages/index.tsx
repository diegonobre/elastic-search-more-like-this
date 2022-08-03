import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import AsyncSelect from "react-select/async";

interface Book {
  _id: string;
  title: string;
  authors: string;
  description: string;
}

const Home: NextPage = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);

  return (
    <div>
      <Head>
        <title>Lookalike search engine</title>
      </Head>
      <div className="container mx-auto p-5">
        <AsyncSelect
          defaultOptions
          isClearable={true}
          placeholder="Start typing a book name..."
          onChange={async (newValue: any) => {
            if (!newValue) {
              setSimilarBooks([]);
              setCurrentBook(null);
              return;
            }
            const response = await fetch(
              `/api/lookalike?id=${newValue.value._id}`
            );
            const data = await response.json();
            setSimilarBooks(data);
            setCurrentBook(newValue.value);
          }}
          loadOptions={async (inputValue: string) => {
            if (inputValue.length < 2) return;
            const response = await fetch(
              `/api/autocomplete?query=${inputValue}`
            );
            const data = await response.json();
            return data.map((item: Book) => ({
              value: item,
              label: (
                <>
                  {item.title}
                  <span className="text-gray-400 text-sm ml-3">
                    {item.authors}
                  </span>
                </>
              ),
            }));
          }}
        />
        <div className="py-7">
          {currentBook !== null && <Book book={currentBook} />}
          {similarBooks.length > 0 && (
            <>
              <h1 className="text-2xl mt-5 mb-2">Lookalike books</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {similarBooks.map((entry: Book) => (
                  <Book book={entry} key={entry._id} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function Book({ book }: { book: Book }) {
  return (
    <div
      key={book._id}
      className="border rounded-md shadow px-3 py-2"
    >
      <div className="text-lg text-bold py-2">
        {book.title}{" "}
        <span className="text-sm text-gray-500 ml-3">
          {book.authors}
        </span>
      </div>
      <div className="text-sm text-gray-700">
        ℹ️ {book.description}
      </div>
    </div>
  );
}

export default Home;
