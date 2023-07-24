import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.0.3"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.8.21"
	kotlin("plugin.spring") version "1.8.21"
	kotlin("plugin.jpa") version "1.8.21"
	kotlin("plugin.serialization") version "1.8.21"
	id("org.flywaydb.flyway") version "9.8.1"
}

val a = System.getenv("WEBSERVER_VERSION") ?: "1"
group = "com.vyatsu"
version = "0.0.${a}"
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
	implementation("org.springframework.boot:spring-boot-starter-data-rest")
	implementation("org.springframework.boot:spring-boot-configuration-processor")
	implementation("me.paulschwarz:spring-dotenv:3.0.0")

	//security
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

	//serialization
	implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.springframework.boot:spring-boot-starter-validation")

	//database
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-jdbc")
	implementation("org.hibernate.orm:hibernate-core:6.2.4.Final")
	runtimeOnly("com.microsoft.sqlserver:mssql-jdbc")
	runtimeOnly("org.flywaydb:flyway-core:9.8.1")
	runtimeOnly("org.flywaydb:flyway-sqlserver")

	// excel
	implementation("org.apache.poi:poi:5.2.3")
	implementation("org.apache.poi:poi-ooxml:5.2.3")
	//tests
	testImplementation("com.h2database:h2")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.mockk:mockk:1.13.5")
	testImplementation("org.springframework.security:spring-security-test")
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