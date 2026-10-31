package dev.emvee.arcamt.cucumber;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.emvee.arcamt.usermanagement.dto.CreateUserRequest;
import dev.emvee.arcamt.usermanagement.dto.UpdateUserRolesRequest;
import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.mock.UserMocks;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.service.UserManagementService;
import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UserManagementStepDefs {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserManagementService userManagementService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String currentRole;
    private ResultActions result;

    @After
    public void clearSecurityContext() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    private void setSecurityContext(String role) {
        var auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                "testuser", null,
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)));
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Given("a user with role USER is authenticated")
    public void aUserWithRoleUserIsAuthenticated() {
        currentRole = "USER";
    }

    @Given("a user with role ADMIN is authenticated")
    public void aUserWithRoleAdminIsAuthenticated() {
        currentRole = "ADMIN";
    }

    @And("a target user exists")
    public void aTargetUserExists() {
        UserDto updatedUser = UserDto.builder()
                .id(1L)
                .username("Username1")
                .roles(Set.of(Role.ROLE_ADMIN))
                .build();
        when(userManagementService.updateUserRoles(eq(1L), any())).thenReturn(updatedUser);
    }

    @When("a GET request is made to {string}")
    public void aGetRequestIsMadeTo(String path) throws Exception {
        when(userManagementService.getUsers()).thenReturn(UserMocks.usersDto);
        setSecurityContext(currentRole);
        result = mockMvc.perform(get(path));
    }

    @When("a POST request is made to {string} with valid user data")
    public void aPostRequestIsMadeToWithValidUserData(String path) throws Exception {
        UserDto createdUser = UserDto.builder()
                .id(4L)
                .username("NewUser")
                .roles(Set.of(Role.ROLE_USER))
                .build();
        when(userManagementService.createUser(any())).thenReturn(createdUser);

        CreateUserRequest request = CreateUserRequest.builder()
                .username("NewUser")
                .password("password123")
                .build();

        setSecurityContext(currentRole);
        result = mockMvc.perform(post(path)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    @When("a PUT request is made to {string} with valid roles data")
    public void aPutRequestIsMadeToWithValidRolesData(String path) throws Exception {
        UpdateUserRolesRequest request = new UpdateUserRolesRequest(Set.of(Role.ROLE_ADMIN));

        setSecurityContext(currentRole);
        result = mockMvc.perform(put(path)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    @Then("the response status is {int}")
    public void theResponseStatusIs(int status) throws Exception {
        result.andExpect(status().is(status));
    }

    @And("the response body is a JSON array")
    public void theResponseBodyIsAJsonArray() throws Exception {
        result.andExpect(jsonPath("$").isArray());
    }

    @And("the response body contains the created user")
    public void theResponseBodyContainsTheCreatedUser() throws Exception {
        result.andExpect(jsonPath("$.username").value("NewUser"));
    }

    @And("the response body contains the updated user")
    public void theResponseBodyContainsTheUpdatedUser() throws Exception {
        result.andExpect(jsonPath("$.id").value(1));
    }
}
