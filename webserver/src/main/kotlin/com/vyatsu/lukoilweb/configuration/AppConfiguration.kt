package com.vyatsu.lukoilweb.configuration

import com.vyatsu.lukoilweb.utils.RsaProperties
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = ["com.vyatsu.lukoilweb"])
@EntityScan(basePackages = ["com.vyatsu.lukoilweb.models"])
@EnableConfigurationProperties(RsaProperties::class)
class AppConfiguration