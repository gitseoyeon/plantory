package org.example.plantory_be.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@Slf4j
public class  WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir.qr}")
    private String qrUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 예: /files/** → file:/var/plantory/uploads/qr/
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + qrUploadDir + "/");

        log.warn("물리적 위치: " + qrUploadDir);
    }
}
