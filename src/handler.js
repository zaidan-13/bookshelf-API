/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

// addBookHandler
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  // eslint-disable-next-line no-unneeded-ternary
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  bookshelf.push(newBooks);

  const isSuccess = bookshelf.filter((b) => b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahakan',
  });

  response.code(500);
  return response;
};

// getAllBooksHandler
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (bookshelf.length > 0) {
    let bookFilter = bookshelf;

    if (name) {
      // eslint-disable-next-line max-len
      bookFilter = bookFilter.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading) {
      bookFilter = bookFilter.filter((book) => book.reading == Number(reading));
    }

    if (finished) {
      bookFilter = bookFilter.filter((book) => book.finished == Number(finished));
    }

    const response = h.response({
      status: 'success',
      data: {
        books: bookFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(200);
  return response;
};

// getBookByIdHandler
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// editBookByIdHandler
const editBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  // eslint-disable-next-line max-len
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBooksByIdHandler, deleteBookByIdHandler,
};
