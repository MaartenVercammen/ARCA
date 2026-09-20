package dev.emvee.arcamt.usermanagement.repository;

import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.usermanagement.repository.model.Address;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserAddressPersistenceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginRepository loginRepository;

    @Test
    void savesUserWithAddressAndGeneratesAddressId() {
        LoginInfo loginInfo = loginRepository.save(new LoginInfo("address-user", "hashed-password"));
        Address address = new Address("Main St", "10", "Metropolis", "10001", "Country");
        User user = User.builder()
                .id(loginInfo.getId())
                .username(loginInfo.getUsername())
                .email("address@example.com")
                .phoneNumber("123456789")
                .address(address)
                .roles(Set.of(Role.ROLE_USER))
                .build();

        User savedUser = userRepository.saveAndFlush(user);

        assertThat(savedUser.getAddress().getId()).isNotNull().isPositive();
        assertThat(savedUser.getAddress().getStreet()).isEqualTo("Main St");
        assertThat(userRepository.findById(savedUser.getId()))
                .get()
                .extracting(User::getAddress)
                .extracting(Address::getCity, Address::getZipCode, Address::getCountry)
                .containsExactly("Metropolis", "10001", "Country");
    }
}