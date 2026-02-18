package com.campus.campus.repository;

import com.campus.campus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByStatus(String status);

    Optional<User> findByEmail(String email);
}
