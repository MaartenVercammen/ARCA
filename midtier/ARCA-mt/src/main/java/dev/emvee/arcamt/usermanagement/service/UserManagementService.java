package dev.emvee.arcamt.usermanagement.service;

import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.service.HashService;
import dev.emvee.arcamt.usermanagement.dto.AddressDto;
import dev.emvee.arcamt.usermanagement.dto.CreateUserRequest;
import dev.emvee.arcamt.usermanagement.dto.UpdateUserRequest;
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
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public UserDto createUser(@Valid CreateUserRequest request) {
        String hashedPassword = hashService.hash(request.password());
        LoginInfo loginInfo = new LoginInfo(request.username(), hashedPassword);
        LoginInfo savedLoginInfo = loginRepository.save(loginInfo);

        Address address = null;
        if (request.address() != null) {
            address = new Address(
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

        return toDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long id, @Valid UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        LoginInfo loginInfo = loginRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Login info not found: " + id));

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(toAddress(request.address()));
        loginInfo.setUsername(request.username());

        loginRepository.save(loginInfo);
        return toDto(userRepository.save(user));
    }

    private Address toAddress(AddressDto address) {
        if (address == null) {
            return null;
        }
        return new Address(address.street(), address.houseNumber(), address.city(), address.zipCode(), address.country());
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
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
                .build();
    }
}
