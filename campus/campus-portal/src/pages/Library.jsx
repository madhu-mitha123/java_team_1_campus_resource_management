import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

function Library() {
  const { credentials } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/library/books", {
      headers: {
        Authorization: `Basic ${credentials.token}`,
      },
    }).then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>Library</h2>

      {books.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <button>Borrow</button>
        </div>
      ))}
    </div>
  );
}

export default Library;
