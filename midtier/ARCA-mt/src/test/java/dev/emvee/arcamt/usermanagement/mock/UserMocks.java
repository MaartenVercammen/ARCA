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
            UserDto.builder().username("Username1").roles(Set.of(Role.ROLE_USER)).build(),
            UserDto.builder().username("Username2").roles(Set.of(Role.ROLE_USER)).build(),
            UserDto.builder().username("Username3").roles(Set.of(Role.ROLE_USER)).build()
    );

    public static List<UserDto> emptyUsersDto = List.of();

    public static List<User> databaseUsers = List.of(
            User.builder().id(1L).username("Username1").roles(Set.of(Role.ROLE_USER)).build(),
            User.builder().id(2L).username("Username2").roles(Set.of(Role.ROLE_USER)).build(),
            User.builder().id(3L).username("Username3").roles(Set.of(Role.ROLE_USER)).build()
    );

}
