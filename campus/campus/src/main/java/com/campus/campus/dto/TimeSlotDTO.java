package com.campus.campus.dto;

import lombok.Data;

@Data
public class TimeSlotDTO {
    private Long id;
    private String startTime;
    private String endTime;
    private String status; // AVAILABLE, BOOKED, PENDING
}
