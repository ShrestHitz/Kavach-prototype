package gov.mospi.sentinel.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler — structured error responses for all REST endpoints.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ── Auth errors ───────────────────────────────────────────

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return error(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                     "Invalid username or password");
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AuthorizationDeniedException ex) {
        return error(HttpStatus.FORBIDDEN, "ACCESS_DENIED",
                     "You do not have permission to access this resource");
    }

    // ── Validation errors ─────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        ErrorResponse err = ErrorResponse.builder()
                .timestamp(OffsetDateTime.now().toString())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("VALIDATION_FAILED")
                .message("Request validation failed")
                .fieldErrors(fieldErrors)
                .build();
        return ResponseEntity.badRequest().body(err);
    }

    // ── Not found ─────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    // ── Generic ───────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR",
                     "An internal error occurred. Please try again later.");
    }

    private ResponseEntity<ErrorResponse> error(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(
            ErrorResponse.builder()
                .timestamp(OffsetDateTime.now().toString())
                .status(status.value())
                .error(code)
                .message(message)
                .build()
        );
    }

    // ── Error response ────────────────────────────────────────

    public record ErrorResponse(
        String timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors
    ) {
        /** Simple factory matching Builder pattern used above. */
        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String timestamp; private int status;
            private String error; private String message;
            private Map<String, String> fieldErrors;
            public Builder timestamp(String v)                 { this.timestamp = v; return this; }
            public Builder status(int v)                       { this.status = v; return this; }
            public Builder error(String v)                     { this.error = v; return this; }
            public Builder message(String v)                   { this.message = v; return this; }
            public Builder fieldErrors(Map<String, String> v)  { this.fieldErrors = v; return this; }
            public ErrorResponse build() {
                return new ErrorResponse(timestamp, status, error, message, fieldErrors);
            }
        }
    }
}
