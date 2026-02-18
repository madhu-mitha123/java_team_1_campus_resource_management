package com.campus.campus.service;

import com.campus.campus.entity.TimeSlot;
import com.campus.campus.entity.Resource;
import com.campus.campus.enums.BookingStatus;
import com.campus.campus.exception.ResourceNotFoundException;
import com.campus.campus.repository.BookingRepository;
import com.campus.campus.repository.ResourceRepository;
import com.campus.campus.repository.TimeSlotRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;

    public TimeSlot create(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }

    public List<TimeSlot> getAll() {
        return timeSlotRepository.findAll();
    }

    public List<com.campus.campus.dto.TimeSlotDTO> getSlotsForResourceAndDate(Long resourceId,
            java.time.LocalDate date) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));

        List<TimeSlot> allSlots = timeSlotRepository.findAll();

        return allSlots.stream().map(slot -> {
            com.campus.campus.dto.TimeSlotDTO dto = new com.campus.campus.dto.TimeSlotDTO();
            dto.setId(slot.getId());
            dto.setStartTime(slot.getStartTime());
            dto.setEndTime(slot.getEndTime());

            // Check if APPROVED booking exists for this slot+resource+date
            boolean booked = bookingRepository.existsByResourceAndTimeSlotAndBookingDateAndStatus(
                    resource, slot, date, BookingStatus.APPROVED);
            // Check if PENDING booking exists
            boolean pending = bookingRepository.existsByResourceAndTimeSlotAndBookingDateAndStatus(
                    resource, slot, date, BookingStatus.PENDING);

            if (booked)
                dto.setStatus("BOOKED");
            else if (pending)
                dto.setStatus("PENDING");
            else
                dto.setStatus("AVAILABLE");

            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    public TimeSlot getById(Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot not found with id: " + id));
    }

    public TimeSlot update(Long id, TimeSlot updated) {
        TimeSlot slot = getById(id);

        slot.setStartTime(updated.getStartTime());
        slot.setEndTime(updated.getEndTime());

        return timeSlotRepository.save(slot);
    }

    public void delete(Long id) {
        timeSlotRepository.deleteById(id);
    }
}
