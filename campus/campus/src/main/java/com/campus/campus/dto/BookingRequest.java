package com.campus.campus.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {

    private Long userId;
    private Long resourceId;
    private Long slotId;
    private LocalDate date;
}
