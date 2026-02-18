package com.campus.campus.controller;

import com.campus.campus.dto.BookingApprovalRequest;
import com.campus.campus.dto.BookingRejectionRequest;
import com.campus.campus.dto.BookingRequest;
import com.campus.campus.entity.Booking;
import com.campus.campus.service.BookingService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/pending")
    public List<Booking> getPendingBookings() {
        return bookingService.getPendingBookings();
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getMyBookings(@PathVariable Long userId) {
        System.out.println("Fetching bookings for userId: " + userId);
        return bookingService.getBookingsByUser(userId);
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {

        return bookingService.createBooking(
                request.getUserId(),
                request.getResourceId(),
                request.getSlotId(),
                request.getDate());
    }

    @PutMapping("/approve")
    public Booking approveBooking(@RequestBody BookingApprovalRequest request) {

        return bookingService.approveBooking(
                request.getBookingId(),
                request.getAdminId());
    }

    @PutMapping("/reject")
    public Booking reject(@RequestBody BookingRejectionRequest request) {

        return bookingService.rejectBooking(
                request.getBookingId(),
                request.getAdminId(),
                request.getReason());
    }

}
