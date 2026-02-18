package com.campus.campus.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRejectionRequest {

    private Long bookingId;
    private Long adminId;
    private String reason;
}
