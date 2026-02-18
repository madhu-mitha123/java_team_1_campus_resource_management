package com.campus.campus.service;

import com.campus.campus.entity.Resource;
import com.campus.campus.enums.ResourceStatus;
import com.campus.campus.enums.ResourceType;
import com.campus.campus.exception.ResourceNotFoundException;
import com.campus.campus.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Resource create(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAll() {
        return resourceRepository.findAll();
    }

    public Resource getById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource update(Long id, Resource updated) {
        Resource resource = getById(id);

        resource.setName(updated.getName());
        resource.setType(updated.getType());
        resource.setCapacity(updated.getCapacity());
        resource.setStatus(updated.getStatus());

        return resourceRepository.save(resource);
    }

    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> filterByType(ResourceType type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> filterByStatus(ResourceStatus status) {
        return resourceRepository.findByStatus(status);
    }

}
