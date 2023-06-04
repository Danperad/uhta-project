package com.vyatsu.lukoilweb.configuration

import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = ["com.vyatsu.lukoilweb"])
@EntityScan(basePackages = ["com.vyatsu.lukoilweb.models"])
class AppConfig