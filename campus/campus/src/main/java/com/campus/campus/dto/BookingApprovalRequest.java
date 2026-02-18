package com.campus.campus.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingApprovalRequest {

    private Long bookingId;
    private Long adminId;
}
