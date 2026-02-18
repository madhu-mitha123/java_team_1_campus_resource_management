package com.campus.campus.repository;

import com.campus.campus.entity.Booking;
import com.campus.campus.entity.Resource;
import com.campus.campus.entity.TimeSlot;
import com.campus.campus.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByResourceAndTimeSlotAndBookingDateAndStatus(
            Resource resource,
            TimeSlot timeSlot,
            LocalDate bookingDate,
            BookingStatus status);

    java.util.List<Booking> findByStatus(BookingStatus status);

    java.util.List<Booking> findByUser_Id(Long userId);

    java.util.Optional<Booking> findFirstByResourceAndTimeSlotAndBookingDateAndStatus(
            Resource resource,
            TimeSlot timeSlot,
            LocalDate bookingDate,
            BookingStatus status);
}
