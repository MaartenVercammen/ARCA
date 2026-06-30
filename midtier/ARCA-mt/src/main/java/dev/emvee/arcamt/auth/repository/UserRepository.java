package dev.emvee.arcamt.auth.repository;

import dev.emvee.arcamt.auth.repository.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
