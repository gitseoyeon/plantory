package org.example.plantory_be.exception;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus()
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
