package com.vyatsu.lukoilweb.configuration

import com.vyatsu.lukoilweb.models.Roles
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.core.GrantedAuthorityDefaults
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver
import org.springframework.security.web.SecurityFilterChain


@Configuration
class SecurityConfiguration {
    @Bean
    fun grantedAuthorityDefaults(): GrantedAuthorityDefaults {
        return GrantedAuthorityDefaults("GUEST")
    }
    @Bean
    fun bearerTokenResolver(): BearerTokenResolver {
        val bearerTokenResolver = DefaultBearerTokenResolver()
        bearerTokenResolver.setBearerTokenHeaderName(HttpHeaders.AUTHORIZATION)
        return bearerTokenResolver
    }
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        val resolver = DefaultBearerTokenResolver()
        resolver.setAllowFormEncodedBodyParameter(true)
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
                authorize("/api/user/**", hasAuthority(Roles.ADMIN.value))
            }
            oauth2ResourceServer {
                bearerTokenResolver = resolver
            }
        }
        return http.build()
    }
}