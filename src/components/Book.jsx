import React from 'react';

function Book({ book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Publisher: {book.publisher}</p>
    </div>
  );
}

export default Book;