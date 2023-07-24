package com.vyatsu.lukoilweb.configuration

import com.vyatsu.lukoilweb.utils.RsaProperties
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import java.text.SimpleDateFormat

@Configuration
@ComponentScan(basePackages = ["com.vyatsu.lukoilweb"])
@EnableJpaRepositories(basePackages = ["com.vyatsu.lukoilweb.repositories"])
@EntityScan(basePackages = ["com.vyatsu.lukoilweb.models"])
@EnableConfigurationProperties(RsaProperties::class)
class AppConfig{
    @Bean
    fun dateFormat() = SimpleDateFormat("dd-MM-yyyy")
}