package com.campus.campus.controller;

import com.campus.campus.entity.Resource;
import com.campus.campus.entity.User;
import com.campus.campus.enums.ResourceStatus;
import com.campus.campus.enums.ResourceType;
import com.campus.campus.enums.Role;
import com.campus.campus.repository.ResourceRepository;
import com.campus.campus.repository.UserRepository;
import com.campus.campus.service.ResourceService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    // CREATE Resource
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.create(resource);
    }

    // GET All Resources
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAll();
    }

    // GET Resource By ID
    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable Long id) {
        return resourceService.getById(id);
    }

    // UPDATE Resource
    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable Long id,
            @RequestBody Resource resource) {
        return resourceService.update(id, resource);
    }

    // DELETE Resource
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable Long id) {
        resourceService.delete(id);
    }

    @GetMapping("/filter/type")
    public List<Resource> filterByType(@RequestParam ResourceType type) {
        return resourceService.filterByType(type);
    }

    @GetMapping("/filter/status")
    public List<Resource> filterByStatus(@RequestParam ResourceStatus status) {
        return resourceService.filterByStatus(status);
    }

    @GetMapping("/by-department")
    public List<Resource> getByDepartment(@RequestParam String dept) {
        return resourceRepository.findByDepartment_Name(dept);
    }

    @GetMapping("/by-role")
    public List<Resource> getResourcesByRole(@RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.STUDENT) {
            return resourceRepository
                    .findByDepartment_NameIgnoreCase(
                            user.getDepartment().getName());
        }

        // STAFF and ADMIN
        return resourceRepository.findAll();
    }

}
