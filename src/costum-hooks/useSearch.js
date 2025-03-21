import { useState, useEffect } from "react";

const BASE_URL = "https://openlibrary.org/search.json";

/**
 * Custom hook pentru căutarea cărților.
 */
export default function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nu căutăm dacă termenul de căutare este gol
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(searchTerm)}&limit=5`);
        if (!response.ok) throw new Error("Nu am putut obține datele de la API");

        const data = await response.json();

        if (data.docs) {
          setSearchResults(
            data.docs.slice(0, 5).map(book => ({
              key: book.key.replace("/works/", ""), // Extragem doar ID-ul
              title: book.title,
              author: book.author_name ? book.author_name.join(", ") : "Autor necunoscut",
              cover_id: book.cover_i || null
            }))
          );
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBooks, 500); // Așteptăm 500ms pentru a evita spamul API-ului
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, searchResults, isLoading, error };
}
