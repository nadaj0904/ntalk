package com.ntalk.choi.controller.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ntalk.choi.domain.common.ApiResponse;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * @Valid 또는 @Validated 로 인한 바인딩 에러 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.debug("Validation error occurred: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        
        ApiResponse<Map<String, String>> response = ApiResponse.error("입력값이 올바르지 않습니다.");
        response.setData(errors);
        
        log.debug("Mapped validation errors: {}", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * 기타 런타임 최상위 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAllExceptions(Exception ex) {
        log.error("Unhandled Exception caught in GlobalExceptionHandler: ", ex);
        // 보안상 내부 Exception 메시지를 그대로 노출하지 않는 것이 권장되나, 현재는 디버깅을 위해 출력
        return new ResponseEntity<>(ApiResponse.error("서버 오류가 발생했습니다: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
