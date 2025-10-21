package org.example.plantory_be.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class  WebConfig implements WebMvcConfigurer {
    @Value("${app.upload.dir.qr}")
    private String qrUploadDir;

    @Value("${app.upload.image}")
    private String imageDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + qrUploadDir + "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + imageDir + "/");
    }
}
