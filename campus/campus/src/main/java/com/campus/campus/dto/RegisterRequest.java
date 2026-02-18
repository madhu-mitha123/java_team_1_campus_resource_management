package com.campus.campus.dto;

import com.campus.campus.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    @Pattern(regexp = "^[A-Za-z ]+$",
            message = "Name must contain only letters")
    private String name;

    @Email
    private String email;

    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @NotBlank
    @Size(min = 6)
    private String password;

    private Role role;

    private String departmentName;
}
