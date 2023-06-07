package com.vyatsu.lukoilweb.configuration

import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jose.jwk.source.ImmutableJWKSet
import com.nimbusds.jose.proc.SecurityContext
import com.vyatsu.lukoilweb.models.Roles
import com.vyatsu.lukoilweb.services.CustomUserDetailsService
import com.vyatsu.lukoilweb.utils.RsaProperties
import com.vyatsu.lukoilweb.utils.jwtAuthenticationConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver
import org.springframework.security.web.SecurityFilterChain


@Configuration
class SecurityConfiguration(
    private val rsaKeys: RsaProperties,
    private val customUserDetailsService: CustomUserDetailsService
) {
    @Bean
    fun passwordEncoder(): BCryptPasswordEncoder? {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun authManager(): AuthenticationManager {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(customUserDetailsService)
        authProvider.setPasswordEncoder(passwordEncoder())
        return ProviderManager(authProvider)
    }

    @Bean
    fun jwtEncoder(): JwtEncoder {
        val jwk = RSAKey.Builder(rsaKeys.publicKey).privateKey(rsaKeys.privateKey).build()
        val jwkSource = ImmutableJWKSet<SecurityContext>(JWKSet(jwk))
        return NimbusJwtEncoder(jwkSource)
    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        return NimbusJwtDecoder.withPublicKey(rsaKeys.publicKey).build()
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
                jwt {
                    jwtAuthenticationConverter = jwtAuthenticationConverter()
                }
                bearerTokenResolver = resolver
            }
        }
        return http.build()
    }
}