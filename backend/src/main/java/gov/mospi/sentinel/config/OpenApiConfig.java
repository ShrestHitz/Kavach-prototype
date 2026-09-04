package gov.mospi.sentinel.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 * UI accessible at: http://localhost:8080/swagger-ui/index.html
 */
@Configuration
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI sentinelOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("MPLADS Sentinel API")
                .description("""
                    AI-powered anomaly detection and project intelligence platform for the MPLAD Scheme.
                    
                    **SIH 2026 | Problem Statement 26102 | MoSPI — DIID**
                    
                    ⚠️ **DEMO MODE**: All project data is synthetic. Not real government records.
                    
                    **Demo Credentials:**
                    - `ministry@sentinel.gov.in` / `Demo@1234` — Full national access
                    - `nodal.tn@sentinel.gov.in` / `Demo@1234` — Tamil Nadu state access
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("MPLADS Sentinel Team")
                    .email("sentinel@mospi.gov.in"))
                .license(new License()
                    .name("Government of India — Internal Use")
                    .url("https://mospi.gov.in"))
            );
    }
}
