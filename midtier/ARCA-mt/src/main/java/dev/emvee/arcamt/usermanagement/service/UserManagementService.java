package dev.emvee.arcamt.usermanagement.service;

import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.service.HashService;
import dev.emvee.arcamt.usermanagement.dto.AddressDto;
import dev.emvee.arcamt.usermanagement.dto.CreateUserRequest;
import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.repository.UserRepository;
import dev.emvee.arcamt.usermanagement.repository.model.Address;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final LoginRepository loginRepository;
    private final HashService hashService;

    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserDto.builder()
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .address(user.getAddress() != null ? AddressDto.builder()
                                .street(user.getAddress().getStreet())
                                .houseNumber(user.getAddress().getHouseNumber())
                                .city(user.getAddress().getCity())
                                .zipCode(user.getAddress().getZipCode())
                                .country(user.getAddress().getCountry())
                                .build() : null)
                        .roles(user.getRoles())
                        .build())
                .toList();
    }

    @Transactional
    public UserDto createUser(@Valid CreateUserRequest request) {
        String hashedPassword = hashService.hash(request.password());
        LoginInfo loginInfo = new LoginInfo(null, request.username(), hashedPassword);
        LoginInfo savedLoginInfo = loginRepository.save(loginInfo);

        Address address = null;
        if (request.address() != null) {
            address = new Address(
                    null,
                    request.address().street(),
                    request.address().houseNumber(),
                    request.address().city(),
                    request.address().zipCode(),
                    request.address().country()
            );
        }

        Set<Role> roles = request.roles() != null && !request.roles().isEmpty()
                ? request.roles()
                : Collections.singleton(Role.ROLE_USER);

        User user = User.builder()
                .id(savedLoginInfo.getId())
                .username(savedLoginInfo.getUsername())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .address(address)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        return UserDto.builder()
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .address(savedUser.getAddress() != null ? AddressDto.builder()
                        .street(savedUser.getAddress().getStreet())
                        .houseNumber(savedUser.getAddress().getHouseNumber())
                        .city(savedUser.getAddress().getCity())
                        .zipCode(savedUser.getAddress().getZipCode())
                        .country(savedUser.getAddress().getCountry())
                        .build() : null)
                .roles(savedUser.getRoles())
                .build();
    }
}
