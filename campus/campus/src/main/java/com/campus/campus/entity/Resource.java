package com.campus.campus.entity;

import com.campus.campus.enums.ResourceStatus;
import com.campus.campus.enums.ResourceType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ResourceType type; // LAB / CLASSROOM / EVENT_HALL

    private int capacity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ResourceStatus status; // AVAILABLE / UNAVAILABLE
}
