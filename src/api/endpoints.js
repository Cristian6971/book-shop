const BASE_URL = "https://openlibrary.org";

/**
 * Caută cărți folosind un query.
 * @param {string} query - Termenul de căutare.
 * @returns {Promise<object>} - Rezultatele căutării.
 */
export async function searchBooks(query) {
  try {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Eroare la căutarea cărților: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în searchBooks:", error);
    throw error;
  }
}

/**
 * Obține detalii despre o carte.
 * @param {string} workKey - Cheia lucrării (ex: "/works/OL45883W").
 * @returns {Promise<object>} - Detaliile cărții.
 */
export async function getBookDetails(workKey) {
  try {
    const response = await fetch(`${BASE_URL}${workKey}.json`);
    if (!response.ok) {
      throw new Error(`Eroare la obținerea detaliilor cărții: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în getBookDetails:", error);
    throw error;
  }
}

/**
 * Obține detalii despre un autor.
 * @param {string} authorKey - Cheia autorului (ex: "/authors/OL2162281A").
 * @returns {Promise<object>} - Detaliile autorului.
 */
export async function getAuthorDetails(authorKey) {
  try {
    const response = await fetch(`${BASE_URL}${authorKey}.json`);
    if (!response.ok) {
      throw new Error(`Eroare la obținerea detaliilor autorului: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în getAuthorDetails:", error);
    throw error;
  }
}

/**
 * Obține cărți pentru un anumit subiect.
 * Se utilizează paginarea cu parametrii `limit` și `offset`.
 * @param {string} subject - Subiectul cărților (ex: "Science Fiction").
 * @param {number} [page=1] - Numărul paginii.
 * @param {number} [limit=100] - Numărul de cărți returnate pe pagină.
 * @returns {Promise<object>} - Lista de cărți pentru subiectul dat.
 */
export async function getBooksBySubject(subject, page = 1, limit = 100) {
  try {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error(`Eroare la obținerea cărților pentru subiect: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în getBooksBySubject:", error);
    throw error;
  }
}

/**
 * Obține edițiile unei cărți pentru o lucrare dată.
 * @param {string} workKey - Cheia lucrării (ex: "/works/OL45883W").
 * @returns {Promise<object>} - Lista edițiilor.
 */
export async function getBookEditions(workKey) {
  try {
    const response = await fetch(`${BASE_URL}${workKey}/editions.json`);
    if (!response.ok) {
      throw new Error(`Eroare la obținerea edițiilor: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în getBookEditions:", error);
    throw error;
  }
}

/**
 * Obține informații despre o carte folosind ISBN-ul.
 * Utilizează endpoint-ul /api/books.
 * @param {string} isbn - ISBN-ul cărții.
 * @returns {Promise<object>} - Informațiile despre carte.
 */
export async function getBookByISBN(isbn) {
  try {
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    if (!response.ok) {
      throw new Error(`Eroare la obținerea cărții după ISBN: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare în getBookByISBN:", error);
    throw error;
  }
}

/**
 * Construiește URL-ul pentru coperțile cărților.
 * @param {number|string} coverId - ID-ul copertei.
 * @param {string} [size='M'] - Mărimea imaginii: S (mic), M (mediu), L (mare).
 * @returns {string} - URL-ul copertei.
 */
export function getCoverUrl(coverId, size = 'M') {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
