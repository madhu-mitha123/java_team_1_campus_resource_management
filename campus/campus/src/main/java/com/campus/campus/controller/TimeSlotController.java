package com.campus.campus.controller;

import com.campus.campus.entity.TimeSlot;
import com.campus.campus.service.TimeSlotService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    // CREATE Time Slot
    @PostMapping
    public TimeSlot createTimeSlot(@RequestBody TimeSlot timeSlot) {
        return timeSlotService.create(timeSlot);
    }

    // GET All Time Slots
    @GetMapping
    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotService.getAll();
    }

    // GET Time Slot By ID
    @GetMapping("/{id}")
    public TimeSlot getTimeSlotById(@PathVariable Long id) {
        return timeSlotService.getById(id);
    }

    // UPDATE Time Slot
    @PutMapping("/{id}")
    public TimeSlot updateTimeSlot(@PathVariable Long id,
            @RequestBody TimeSlot timeSlot) {
        return timeSlotService.update(id, timeSlot);
    }

    // DELETE Time Slot
    @DeleteMapping("/{id}")
    public void deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.delete(id);
    }

    // GET Time Slots with Status
    @GetMapping(params = { "resourceId", "date" })
    public List<com.campus.campus.dto.TimeSlotDTO> getSlots(
            @RequestParam Long resourceId,
            @RequestParam java.time.LocalDate date) {
        return timeSlotService.getSlotsForResourceAndDate(resourceId, date);
    }
}
