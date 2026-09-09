package dev.emvee.arcamt.usermanagement.mock;

import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMocks {

    public static List<UserDto> usersDto = List.of(
            new UserDto("Username1", Set.of(Role.ROLE_USER)),
            new UserDto("Username2", Set.of(Role.ROLE_USER)),
            new UserDto("Username3", Set.of(Role.ROLE_USER))
    );

    public static List<UserDto> emptyUsersDto = List.of();

    public static List<User> databaseUsers = List.of(
            new User(1L, "Username1", Set.of(Role.ROLE_USER)),
            new User(2L, "Username2", Set.of(Role.ROLE_USER)),
            new User(3L, "Username3", Set.of(Role.ROLE_USER))
    );



}
