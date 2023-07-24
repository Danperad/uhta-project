package com.vyatsu.lukoilweb.configuration

import com.vyatsu.lukoilweb.models.Roles
import com.vyatsu.lukoilweb.security.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
class SecurityConfiguration(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val authManager : AuthenticationManager
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            csrf { disable() }
            sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }
            authorizeRequests {
                authorize("/api/user/auth", permitAll)
                authorize(HttpMethod.GET, "/api/applications/**", permitAll)
                authorize(HttpMethod.GET, "/api/consumables/**", permitAll)
                authorize(HttpMethod.GET, "/api/devices/**", permitAll)
                authorize(HttpMethod.POST, "/api/applications/**", hasAuthority(Roles.WORKER.value))
                authorize(HttpMethod.POST, "/api/consumables/**", hasAuthority(Roles.WORKER.value))
                authorize(HttpMethod.POST, "/api/devices/**", hasAuthority(Roles.WORKER.value))
//                authorize("/api/user/**", hasAuthority(Roles.ADMIN.value))
            }
            authenticationManager = authManager
            addFilterBefore<UsernamePasswordAuthenticationFilter>(jwtAuthenticationFilter)
        }
        return http.build()
    }
}