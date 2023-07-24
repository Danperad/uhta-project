package com.vyatsu.lukoilweb.configuration

import com.vyatsu.lukoilweb.security.TokenSecret
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import java.text.SimpleDateFormat

@Configuration
@ComponentScan(basePackages = ["com.vyatsu.lukoilweb"])
@EntityScan(basePackages = ["com.vyatsu.lukoilweb.models"])
@EnableConfigurationProperties(TokenSecret::class)
class AppConfig{
    @Bean
    fun dateFormat() = SimpleDateFormat("dd-MM-yyyy")
}