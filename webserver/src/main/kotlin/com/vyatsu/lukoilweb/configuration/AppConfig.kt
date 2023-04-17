package com.vyatsu.lukoilweb.configuration

import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@ComponentScan(basePackages = ["com.vyatsu.lukoilweb"])
@EnableJpaRepositories(basePackages = ["com.vyatsu.lukoilweb.repositories"])
@EntityScan(basePackages = ["com.vyatsu.lukoilweb.models"])
class AppConfig