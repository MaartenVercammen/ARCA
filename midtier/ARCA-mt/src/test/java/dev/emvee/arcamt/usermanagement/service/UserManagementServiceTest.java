package dev.emvee.arcamt.usermanagement.service;
    
import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.mock.UserMocks;
import dev.emvee.arcamt.usermanagement.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserManagementServiceTest {

    @Mock
    private UserRepository userRepository;

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
        assert result.equals(UserMocks.usersDto);
    }
}