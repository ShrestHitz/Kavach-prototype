package gov.mospi.sentinel.exception;

/**
 * Thrown when a requested resource is not found (404).
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entity, Object id) {
        super(entity + " not found with id: " + id);
    }
}
