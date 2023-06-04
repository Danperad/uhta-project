import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.1.0"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.8.21"
	kotlin("plugin.spring") version "1.8.21"
	kotlin("plugin.jpa") version "1.8.21"
	kotlin("plugin.serialization") version "1.8.21"
	id("org.flywaydb.flyway") version "9.8.1"
}

group = "com.vyatsu"
version = "0.0.1"
java.sourceCompatibility = JavaVersion.VERSION_17

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	//springboot
	implementation("org.springframework.boot:spring-boot-starter-data-rest:3.0.4")
	implementation("org.springframework.boot:spring-boot-starter-cache:3.1.0")
	implementation("org.springframework.boot:spring-boot-starter-security:3.0.4")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server:3.1.0")
	implementation("me.paulschwarz:spring-dotenv:3.0.0")

	//serialization
	implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.14.2")
	implementation("org.springframework.boot:spring-boot-starter-validation:3.0.4")

	//database
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc:3.0.4")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.0.4")
	implementation("org.springframework.boot:spring-boot-starter-jdbc:3.0.4")
	runtimeOnly("com.microsoft.sqlserver:mssql-jdbc:12.2.0.jre11")
	runtimeOnly("org.flywaydb:flyway-core:9.16.0")
	runtimeOnly("org.flywaydb:flyway-sqlserver:9.16.0")

	// excel
	implementation("org.apache.poi:poi:5.2.3")
	implementation("org.apache.poi:poi-ooxml:5.2.3")
	//tests
	testImplementation("com.h2database:h2:2.1.214")
	testImplementation("org.springframework.boot:spring-boot-starter-test:3.1.0")
	testImplementation("org.springframework.security:spring-security-test:6.0.2")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.getByName<Jar>("jar") {
	enabled = false
}