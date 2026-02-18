package com.campus.campus.controller;

import com.campus.campus.entity.Book;
import com.campus.campus.entity.BorrowRecord;
import com.campus.campus.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    // Add book
    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return libraryService.addBook(book);
    }

    // Get all books
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return libraryService.getAllBooks();
    }

    // Borrow book
    @PostMapping("/borrow")
    public BorrowRecord borrowBook(@RequestParam Long userId,
                                   @RequestParam Long bookId) {
        return libraryService.borrowBook(userId, bookId);
    }
}
