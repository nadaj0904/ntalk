package com.ntalk.choi;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    @Test
    public void generateHash() {
        System.out.println("HASH_OUTPUT: " + new BCryptPasswordEncoder().encode("admin123!"));
    }
}
