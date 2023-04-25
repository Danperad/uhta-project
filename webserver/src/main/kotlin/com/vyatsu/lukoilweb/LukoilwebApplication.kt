package com.vyatsu.lukoilweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class LukoilwebApplication

fun main(args: Array<String>) {
	runApplication<LukoilwebApplication>(*args)
}
