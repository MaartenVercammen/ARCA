package dev.emvee.arcamt.auth.repository;

import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<LoginInfo, Long> {

    LoginInfo findByUsername(String username);

}
