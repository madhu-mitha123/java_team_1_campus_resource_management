package com.campus.campus.entity;

import com.campus.campus.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Resource resource;

    @ManyToOne
    private TimeSlot timeSlot;

    private LocalDate bookingDate;

    // 👇 THIS IS IMPORTANT
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private String rejectionReason;
    private String cancellationReason;

    @ManyToOne
    private User approvedBy;

    @PrePersist
    public void setDefaultStatus() {
        if (status == null) {
            status = BookingStatus.PENDING;
        }
    }

}
