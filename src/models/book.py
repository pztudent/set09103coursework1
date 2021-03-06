class Book():
  # initialise object with database connection
  def __init__(self, db):
    self.db = db

  # return single book with given id
  def get_book(self, id):
    for row in self.db.cursor().execute('SELECT book_id, title, cover, publisher, pages, year, description FROM books WHERE book_id = ' + str(id)):
      book = {
        'id' : row[0],
        'title' : row[1],
        'cover' : row[2],
        'publisher' : row[3],
        'pages' : row[4],
        'year' : row[5],
        'description' : row[6],
        'authors' : self.get_authors(row[0])
      }

      if book['description'] == '':
        book['description'] = default_text

    return book

  # return book authors
  def get_authors(self, book_id):
    authors = []
    author = Author(self.db)

    for author_id in self.db.cursor().execute('SELECT author_id FROM book_author WHERE book_id =' + str(book_id)):
      authors.append(author.get_author(author_id[0]))

    return authors

  # return all books from database
  def all(self):
    books = []
    for row in self.db.cursor().execute('SELECT book_id, title, cover, publisher, pages, year, description FROM books'):
      book = {
        'id' : row[0],
        'title' : row[1],
        'cover' : row[2],
        'publisher' : row[3],
        'pages' : row[4],
        'year' : row[5],
        'description' : row[6],
        'authors' : self.get_authors(row[0])
      }

      if book['description'] == '':
        book['description'] = default_text

      books.append(book)

    return books

  # return all books for given search string
  def search(self, query):
    books = []

    for row in self.db.cursor().execute('SELECT book_id, title, cover, publisher, pages, year, description FROM books WHERE ' + query):
      book = {
        'id' : row[0],
        'title' : row[1],
        'cover' : row[2],
        'publisher' : row[3],
        'pages' : row[4],
        'year' : row[5],
        'description' : row[6],
        'authors' : self.get_authors(row[0])
      }

      if book['description'] == '':
        book['description'] = default_text

      books.append(book)

    return books

  def create_book(self, title, year, publisher, cover, genre_id, pages, description, authors):
    """Add new book and book_author entry to related tables."""
    books = self.all()

    if len(books) > 0:
      last_book = books[-1]
      last_id = last_book['id']
    else:
      last_id = 0

    book_id = int(last_id) + 1

    data = (book_id, title, year, publisher, cover, genre_id, pages, description)

    self.db.cursor().execute('INSERT INTO books VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
    self.db.commit()

    for author in authors:
      data = (book_id, int(author))
      self.db.cursor().execute('INSERT INTO book_author VALUES (?, ?)', data)
      self.db.commit()

default_text = 'Nulla laoreet, tortor eget sagittis pulvinar, leo risus feugiat nisl, at condimentum erat turpis non nisl. Donec ac leo ultrices, aliquet magna ultricies, efficitur est. Donec pharetra lobortis urna. Nunc arcu est, posuere et diam sit amet, ultrices lobortis leo. Sed eu urna non neque ultrices malesuada. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi commodo, nisl eu viverra euismod, tortor neque hendrerit metus, sit amet efficitur nisl nunc in nisi. Donec id accumsan purus. Ut sit amet mi gravida, tempor magna porttitor, egestas nulla. Donec iaculis massa vitae dui auctor, eget placerat justo scelerisque. Aenean scelerisque nunc vestibulum felis accumsan tempor. Donec eu ornare nibh, ut interdum magna.'


from author import Author
