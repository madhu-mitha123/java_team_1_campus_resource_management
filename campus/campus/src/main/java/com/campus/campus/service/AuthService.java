package com.campus.campus.service;

import com.campus.campus.dto.LoginRequest;
import com.campus.campus.dto.RegisterRequest;
import com.campus.campus.entity.Department;
import com.campus.campus.entity.User;
import com.campus.campus.enums.Role;
import com.campus.campus.repository.DepartmentRepository;
import com.campus.campus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(String.valueOf(request.getRole())));
        user.setStatus("ACTIVE");

        // 🔥 If STUDENT → Department Required
        if (user.getRole() == Role.STUDENT) {

            if (request.getDepartmentName() == null ||
                    request.getDepartmentName().isEmpty()) {

                throw new RuntimeException("Department is required for students");
            }

            Department department = departmentRepository
                    .findFirstByNameIgnoreCase(request.getDepartmentName())
                    .orElseThrow(() -> new RuntimeException("Department not found: " + request.getDepartmentName()));

            user.setDepartment(department);
        }

        // STAFF & ADMIN → department optional (can be null)

        return userRepository.save(user);
    }

    // LOGIN
    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        return user; // 🔥 RETURN FULL USER
    }
}
