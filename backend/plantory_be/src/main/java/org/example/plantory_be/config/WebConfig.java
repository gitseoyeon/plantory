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

    @Value("${app.upload.dir.plant}")
    private String plantUploadDir;

    @Value("${app.upload.image}")
    private String imageDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 예: /files/** → file:/var/plantory/uploads/qr/
        registry.addResourceHandler("/files/qr/**")
                .addResourceLocations("file:" + qrUploadDir + "/");

        registry.addResourceHandler("/files/plant/**")
                .addResourceLocations("file:" + plantUploadDir + "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + imageDir + "/");

    }
}
