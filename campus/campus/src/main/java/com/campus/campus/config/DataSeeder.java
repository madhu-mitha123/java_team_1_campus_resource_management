package com.campus.campus.config;

import com.campus.campus.entity.Department;
import com.campus.campus.entity.Resource;
import com.campus.campus.entity.TimeSlot;
import com.campus.campus.entity.User;
import com.campus.campus.enums.ResourceType;
import com.campus.campus.enums.ResourceStatus;
import com.campus.campus.enums.Role;
import com.campus.campus.repository.DepartmentRepository;
import com.campus.campus.repository.ResourceRepository;
import com.campus.campus.repository.TimeSlotRepository;
import com.campus.campus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) {
        seedDepartments(); // always ensure all depts exist
        if (timeSlotRepository.count() == 0) {
            seedTimeSlots();
        }
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (resourceRepository.count() == 0) {
            seedResources();
        }
    }

    private void seedDepartments() {
        String[] deptNames = { "CSE", "ECE", "EEE", "IT", "MECH", "CIVIL", "AUTO" };
        for (String name : deptNames) {
            // Only insert if not already present — avoids duplicates
            if (departmentRepository.findFirstByNameIgnoreCase(name).isEmpty()) {
                Department d = new Department();
                d.setName(name);
                departmentRepository.save(d);
            }
        }
        System.out.println("Departments ready.");
    }

    private void seedUsers() {
        Department cse = departmentRepository.findFirstByNameIgnoreCase("CSE").orElse(null);

        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@campus.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setPhone("9999999999");
        admin.setStatus("ACTIVE");

        User staff = new User();
        staff.setName("Staff Member");
        staff.setEmail("staff@campus.com");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setRole(Role.STAFF);
        staff.setPhone("8888888888");
        staff.setStatus("ACTIVE");
        staff.setDepartment(cse);

        User student = new User();
        student.setName("Student User");
        student.setEmail("student@campus.com");
        student.setPassword(passwordEncoder.encode("student123"));
        student.setRole(Role.STUDENT);
        student.setPhone("7777777777");
        student.setStatus("ACTIVE");
        student.setDepartment(cse);

        userRepository.saveAll(List.of(admin, staff, student));
        System.out.println("Users seeded!");
    }

    private void seedResources() {
        Department cse = departmentRepository.findFirstByNameIgnoreCase("CSE").orElse(null);

        Resource c1 = new Resource();
        c1.setName("Room 101");
        c1.setType(ResourceType.CLASSROOM);
        c1.setCapacity(50);
        c1.setStatus(ResourceStatus.AVAILABLE);
        c1.setDepartment(cse);

        Resource l1 = new Resource();
        l1.setName("Physics Lab");
        l1.setType(ResourceType.LAB);
        l1.setCapacity(20);
        l1.setStatus(ResourceStatus.AVAILABLE);
        l1.setDepartment(cse);

        Resource h1 = new Resource();
        h1.setName("Main Auditorium");
        h1.setType(ResourceType.AUDITORIUM);
        h1.setCapacity(500);
        h1.setStatus(ResourceStatus.AVAILABLE);

        Resource lib1 = new Resource();
        lib1.setName("Station A1");
        lib1.setType(ResourceType.LIBRARY_STATION);
        lib1.setCapacity(1);
        lib1.setStatus(ResourceStatus.AVAILABLE);

        Resource canteen1 = new Resource();
        canteen1.setName("Table 5");
        canteen1.setType(ResourceType.CANTEEN);
        canteen1.setCapacity(4);
        canteen1.setStatus(ResourceStatus.AVAILABLE);

        Resource book1 = new Resource();
        book1.setName("Introduction to Algorithms");
        book1.setType(ResourceType.BOOK);
        book1.setCapacity(1);
        book1.setStatus(ResourceStatus.AVAILABLE);

        resourceRepository.saveAll(List.of(c1, l1, h1, lib1, canteen1, book1));
        System.out.println("Resources seeded!");
    }

    private void seedTimeSlots() {
        String[][] slots = {
                { "08:00", "09:00" }, { "09:00", "10:00" }, { "10:00", "11:00" },
                { "11:00", "12:00" }, { "12:00", "13:00" }, { "13:00", "14:00" },
                { "14:00", "15:00" }, { "15:00", "16:00" }, { "16:00", "17:00" }
        };
        List<TimeSlot> timeSlotList = new ArrayList<>();
        for (String[] s : slots) {
            TimeSlot ts = new TimeSlot();
            ts.setStartTime(s[0]);
            ts.setEndTime(s[1]);
            timeSlotList.add(ts);
        }
        timeSlotRepository.saveAll(timeSlotList);
        System.out.println("Time slots seeded!");
    }
}
