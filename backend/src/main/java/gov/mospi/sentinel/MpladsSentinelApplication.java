package gov.mospi.sentinel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * MPLADS Sentinel — Main Application
 * AI-powered project intelligence platform | SIH 2026 | MoSPI
 */
@SpringBootApplication
@EnableAsync
public class MpladsSentinelApplication {

    public static void main(String[] args) {
        SpringApplication.run(MpladsSentinelApplication.class, args);
    }
}
