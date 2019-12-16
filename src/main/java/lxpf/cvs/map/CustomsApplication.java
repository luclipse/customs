package lxpf.cvs.map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * CustomsApplication
 * springboot 시작 클래스
 *
 * @author      정호경
 * @since       2019.11.28
 * @version     1.0
 * @see
 **/

@EnableEurekaClient
@SpringBootApplication
public class CustomsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomsApplication.class, args);
    }
}