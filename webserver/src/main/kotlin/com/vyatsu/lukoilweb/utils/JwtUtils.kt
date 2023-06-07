package com.vyatsu.lukoilweb.utils

import org.springframework.context.annotation.Bean
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator
import org.springframework.security.oauth2.core.OAuth2TokenValidator
import org.springframework.security.oauth2.jwt.*
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import java.time.Duration

@Bean
fun jwtDecoder(): JwtDecoder {
    val jwtDecoder: NimbusJwtDecoder = JwtDecoders.fromIssuerLocation("self") as NimbusJwtDecoder
    val withClockSkew: OAuth2TokenValidator<Jwt> = DelegatingOAuth2TokenValidator(
        JwtTimestampValidator(Duration.ofHours(1)),
        JwtIssuerValidator("self")
    )

    jwtDecoder.setJwtValidator(withClockSkew)

    return jwtDecoder
}

@Bean
fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
    val grantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter()
    grantedAuthoritiesConverter.apply {
        this.setAuthoritiesClaimName("authorities")
    }

    val jwtAuthenticationConverter = JwtAuthenticationConverter()
    jwtAuthenticationConverter.apply {
        this.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter)
    }
    return jwtAuthenticationConverter
}