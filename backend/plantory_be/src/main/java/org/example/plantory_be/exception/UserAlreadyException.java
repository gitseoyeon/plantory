package org.example.plantory_be.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserAlreadyException extends RuntimeException{
    public UserAlreadyException(String message) {
        super(message);
    }
}
