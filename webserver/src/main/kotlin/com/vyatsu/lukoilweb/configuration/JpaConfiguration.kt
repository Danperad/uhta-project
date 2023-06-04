package com.vyatsu.lukoilweb.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.transaction.annotation.EnableTransactionManagement

@Configuration
@EnableJpaRepositories(basePackages = ["com.vyatsu.lukoilweb.repositories"])
@EnableTransactionManagement
class JpaConfiguration