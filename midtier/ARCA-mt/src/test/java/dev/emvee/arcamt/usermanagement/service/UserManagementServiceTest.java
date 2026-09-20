package dev.emvee.arcamt.usermanagement.service;

import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.service.HashService;
import dev.emvee.arcamt.usermanagement.dto.AddressDto;
import dev.emvee.arcamt.usermanagement.dto.CreateUserRequest;
import dev.emvee.arcamt.usermanagement.dto.UpdateUserRequest;
import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.mock.UserMocks;
import dev.emvee.arcamt.usermanagement.repository.UserRepository;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserManagementServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LoginRepository loginRepository;

    @Mock
    private HashService hashService;

    @InjectMocks
    private UserManagementService userManagementService;

    @Test
    @DisplayName("GetUsers queries database and returns list of user")
    void GetUsers_QueriesDatabaseAndReturnsListOfUser() {
        // Arrange
        when(userRepository.findAll()).thenReturn(UserMocks.databaseUsers);
        // Act
        List<UserDto> result = userManagementService.getUsers();
        // Assert
        assertThat(result).isEqualTo(UserMocks.usersDto);
    }

    @Test
    @DisplayName("CreateUser saves login info and user entity and returns user dto")
    void CreateUser_SavesLoginInfoAndUser_ReturnsUserDto() {
        // Arrange
        CreateUserRequest request = CreateUserRequest.builder()
                .username("newuser")
                .password("secret123")
                .email("test@example.com")
                .phoneNumber("123456789")
                .address(AddressDto.builder()
                        .street("Main St")
                        .houseNumber("10")
                        .city("Metropolis")
                        .zipCode("10001")
                        .country("Country")
                        .build())
                .roles(Set.of(Role.ROLE_ADMIN))
                .build();

        when(hashService.hash("secret123")).thenReturn("hashed_secret123");
        when(loginRepository.save(any(LoginInfo.class))).thenAnswer(invocation -> {
            LoginInfo info = invocation.getArgument(0);
            info.setId(42L);
            return info;
        });
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserDto result = userManagementService.createUser(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo("newuser");
        assertThat(result.email()).isEqualTo("test@example.com");
        assertThat(result.phoneNumber()).isEqualTo("123456789");
        assertThat(result.roles()).containsExactly(Role.ROLE_ADMIN);
        assertThat(result.address()).isNotNull();
        assertThat(result.address().street()).isEqualTo("Main St");

        ArgumentCaptor<LoginInfo> loginCaptor = ArgumentCaptor.forClass(LoginInfo.class);
        verify(loginRepository).save(loginCaptor.capture());
        assertThat(loginCaptor.getValue().getUsername()).isEqualTo("newuser");
        assertThat(loginCaptor.getValue().getPassword()).isEqualTo("hashed_secret123");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getId()).isEqualTo(42L);
        assertThat(userCaptor.getValue().getUsername()).isEqualTo("newuser");
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("test@example.com");
        assertThat(userCaptor.getValue().getAddress().getId()).isNull();
    }

    @Test
    @DisplayName("UpdateUser updates profile and login name without changing password or roles")
    void UpdateUser_UpdatesProfileAndLoginName_PreservesPasswordAndRoles() {
        User user = User.builder().id(42L).username("olduser").email("old@example.com")
                .roles(Set.of(Role.ROLE_ADMIN)).build();
        LoginInfo loginInfo = new LoginInfo("olduser", "stored-password");
        loginInfo.setId(42L);
        UpdateUserRequest request = UpdateUserRequest.builder()
                .username("updateduser").email("new@example.com").phoneNumber("555")
                .address(AddressDto.builder().street("New St").city("City").build()).build();
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));
        when(loginRepository.findById(42L)).thenReturn(Optional.of(loginInfo));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(loginRepository.save(any(LoginInfo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = userManagementService.updateUser(42L, request);

        assertThat(result.id()).isEqualTo(42L);
        assertThat(result.username()).isEqualTo("updateduser");
        assertThat(result.address().street()).isEqualTo("New St");
        assertThat(loginInfo.getUsername()).isEqualTo("updateduser");
        assertThat(loginInfo.getPassword()).isEqualTo("stored-password");
        assertThat(user.getRoles()).containsExactly(Role.ROLE_ADMIN);
    }
}