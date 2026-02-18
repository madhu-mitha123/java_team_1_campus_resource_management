package com.campus.campus.service;

import com.campus.campus.entity.*;
import com.campus.campus.enums.BookingStatus;
import com.campus.campus.enums.Role;
import com.campus.campus.exception.ResourceNotFoundException;
import com.campus.campus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final BookingRepository bookingRepository;
        private final UserRepository userRepository;
        private final ResourceRepository resourceRepository; // 👈 MUST ADD
        private final TimeSlotRepository timeSlotRepository; // 👈 MUST ADD

        public List<Booking> getAllBookings() {
                return bookingRepository.findAll();
        }

        public List<Booking> getPendingBookings() {
                return bookingRepository.findByStatus(BookingStatus.PENDING);
        }

        public List<Booking> getBookingsByUser(Long userId) {
                return bookingRepository.findByUser_Id(userId);
        }

        public Booking createBooking(Long userId,
                        Long resourceId,
                        Long slotId,
                        LocalDate date) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Resource resource = resourceRepository.findById(resourceId)
                                .orElseThrow(() -> new RuntimeException("Resource not found"));

                TimeSlot timeSlot = timeSlotRepository.findById(slotId)
                                .orElseThrow(() -> new RuntimeException("TimeSlot not found"));

                // 🔥 ROLE + DEPARTMENT VALIDATION (PASTE HERE)

                if (user.getRole() == Role.STUDENT) {
                        // If resource belongs to a department, student must match it
                        if (resource.getDepartment() != null) {
                                if (user.getDepartment() == null) {
                                        throw new RuntimeException("Student department is not assigned");
                                }
                                if (!resource.getDepartment().getName()
                                                .equalsIgnoreCase(user.getDepartment().getName())) {
                                        throw new RuntimeException(
                                                        "Students can book only their department resources ("
                                                                        + resource.getDepartment().getName() + ")");
                                }
                        }
                        // If resource has no department (e.g. Auditorium/Canteen), student can book it.
                }

                // STAFF and ADMIN skip department check

                // 🔥 CONFLICT & PRIORITY LOGIC
                java.util.Optional<Booking> existingOpt = bookingRepository
                                .findFirstByResourceAndTimeSlotAndBookingDateAndStatus(
                                                resource,
                                                timeSlot,
                                                date,
                                                BookingStatus.APPROVED);

                // If no approved booking, check for pending ones (priority also applies to
                // pending)
                if (existingOpt.isEmpty()) {
                        existingOpt = bookingRepository.findFirstByResourceAndTimeSlotAndBookingDateAndStatus(
                                        resource, timeSlot, date, BookingStatus.PENDING);
                }

                if (existingOpt.isPresent()) {
                        Booking existing = existingOpt.get();

                        // STAFF/ADMIN can override STUDENT
                        if ((user.getRole() == Role.STAFF || user.getRole() == Role.ADMIN) &&
                                        existing.getUser().getRole() == Role.STUDENT) {

                                // Overwrite the student booking
                                existing.setStatus(BookingStatus.REJECTED);
                                existing.setRejectionReason("Staff requested this resource");
                                bookingRepository.save(existing);
                                // Continue to create the new staff booking
                        } else {
                                // Real conflict
                                throw new IllegalArgumentException("This time slot is already booked");
                        }
                }

                Booking booking = new Booking();
                booking.setUser(user);
                booking.setResource(resource);
                booking.setTimeSlot(timeSlot);
                booking.setBookingDate(date);
                booking.setStatus(BookingStatus.PENDING);

                return bookingRepository.save(booking);
        }

        public Booking approveBooking(Long bookingId, Long adminId) {

                // 1️⃣ Check Booking exists
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Booking not found with id: " + bookingId));

                // 2️⃣ Check Admin exists
                User admin = userRepository.findById(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with id: " + adminId));

                // 3️⃣ Validate Role
                if (admin.getRole() != Role.ADMIN) {
                        throw new RuntimeException("Only ADMIN can approve bookings");
                }

                // 4️⃣ Validate Status
                if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new RuntimeException("Only PENDING bookings can be approved");
                }

                // 5️⃣ Approve
                booking.setStatus(BookingStatus.APPROVED);
                booking.setApprovedBy(admin);

                return bookingRepository.save(booking);
        }

        public Booking rejectBooking(Long bookingId,
                        Long adminId,
                        String reason) {

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                User admin = userRepository.findById(adminId)
                                .orElseThrow(() -> new RuntimeException("Admin not found"));

                // Check admin role
                if (admin.getRole() != Role.ADMIN) {
                        throw new RuntimeException("Only ADMIN can reject");
                }

                // 🔥 REMOVE STATUS VALIDATION TEMPORARILY FOR DEBUG
                // (We will add back later)

                booking.setStatus(BookingStatus.REJECTED);
                booking.setRejectionReason(reason);
                booking.setApprovedBy(admin);

                Booking savedBooking = bookingRepository.save(booking);

                System.out.println("Saved Status: " + savedBooking.getStatus());
                System.out.println("Saved Reason: " + savedBooking.getRejectionReason());

                return savedBooking;
        }
}
