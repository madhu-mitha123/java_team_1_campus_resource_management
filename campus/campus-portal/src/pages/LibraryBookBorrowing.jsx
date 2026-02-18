import { useState, useEffect } from "react";
import BookingLayout from "../components/booking/BookingLayout";
import SlotGrid from "../components/booking/SlotGrid";
import styles from "../styles/booking.module.css";
import api from "../api/axiosConfig";

function LibraryBookBorrowing() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredBooks(books.filter((b) => b.name.toLowerCase().includes(term)));
    }, [searchTerm, books]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/resources/by-role?userId=${user.id}`);
            const bookList = res.data.filter((r) => r.type === "BOOK");
            setBooks(bookList);
            setFilteredBooks(bookList);
        } catch (err) {
            setError("Could not load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async (resourceId, date) => {
        setTimeSlots([]);
        setSelectedSlot(null);
        try {
            const res = await api.get(`/api/timeslots?resourceId=${resourceId}&date=${date}`);
            setTimeSlots(res.data);
        } catch {
            setTimeSlots([]);
        }
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setSelectedSlot(null);
        setSuccess("");
        setError("");
        if (selectedDate) fetchSlots(book.id, selectedDate);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedSlot(null);
        if (selectedBook) fetchSlots(selectedBook.id, date);
    };

    const handleBorrow = async () => {
        setError("");
        setSuccess("");
        if (!selectedBook || !selectedDate) {
            setError("Please select a book and pickup date.");
            return;
        }
        if (timeSlots.length > 0 && !selectedSlot) {
            setError("Please select a pickup time slot.");
            return;
        }
        try {
            await api.post("/api/bookings", {
                userId: user.id,
                resourceId: selectedBook.id,
                slotId: selectedSlot ? selectedSlot.id : null,
                date: selectedDate,
            });
            setSuccess(`✅ "${selectedBook.name}" borrow request submitted! Awaiting approval.`);
            setSelectedSlot(null);
            if (selectedDate) fetchSlots(selectedBook.id, selectedDate);
        } catch (err) {
            const msg = typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message || "Borrow request failed.";
            setError(msg);
        }
    };

    return (
        <BookingLayout title="📖 Library Book Borrowing">
            <div className={styles.glassCard}>
                <p className={styles.sectionTitle}>Step 1 — Select Pickup Date</p>
                <input type="date" className={styles.dateInput} value={selectedDate} onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]} />
            </div>

            {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
            {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

            <div className={styles.glassCard}>
                <p className={styles.sectionTitle}>Step 2 — Search & Select Book</p>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="🔍 Search books by title…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading ? <p>Loading books…</p> : (
                    <div className={styles.resourceGrid}>
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className={`${styles.resourceCard} ${selectedBook?.id === book.id ? styles.selected : ""}`}
                                onClick={() => handleBookSelect(book)}
                            >
                                <div className={styles.cardIcon}>📖</div>
                                <div className={styles.cardTitle}>{book.name}</div>
                                <div className={styles.cardMeta}>
                                    <span>Copies: {book.capacity}</span>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[book.status] || ""}`}>{book.status}</span>
                            </div>
                        ))}
                        {filteredBooks.length === 0 && <p className={styles.noSlots}>No books found.</p>}
                    </div>
                )}
            </div>

            {selectedBook && selectedDate && (
                <div className={styles.glassCard}>
                    <p className={styles.sectionTitle}>Step 3 — Select Pickup Slot for <strong>{selectedBook.name}</strong></p>
                    <SlotGrid slots={timeSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
                    <button className={styles.actionButton} onClick={handleBorrow}
                        disabled={timeSlots.length > 0 && !selectedSlot}>
                        Confirm Borrow Request
                    </button>
                </div>
            )}
        </BookingLayout>
    );
}

export default LibraryBookBorrowing;
