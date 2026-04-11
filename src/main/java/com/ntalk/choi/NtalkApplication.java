package com.ntalk.choi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ntalk.choi.repository")
public class NtalkApplication {
    //start
	public static void main(String[] args) {
		SpringApplication.run(NtalkApplication.class, args);
	}
	
	

}
