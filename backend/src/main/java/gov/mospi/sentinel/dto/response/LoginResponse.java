package gov.mospi.sentinel.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

/**
 * Login response DTO — returned after successful authentication.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private String token;
    private String tokenType;
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private Integer stateId;
    private String stateName;
}
