package hellocucmber;

import dev.emvee.arcamt.controller.HealthController;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(Cucumber.class)
@CucumberOptions(features = "classpath:hellocucmber")
public class StepDefinitions {

    private MockMvc mockMvc;
    private MvcResult result;

    @Given("the application is running")
    public void the_application_is_running() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new HealthController())
                .build();
    }

    @When("I make a call")
    public void i_make_a_call() throws Exception {
        result = mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Then("It should repsoned with {string}")
    public void it_should_repsoned_with(String expected) throws Exception {
        String body = result.getResponse().getContentAsString();
        assertEquals(expected, body);
    }
}
