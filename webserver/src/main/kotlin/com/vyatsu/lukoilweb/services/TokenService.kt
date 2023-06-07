package com.vyatsu.lukoilweb.services

import com.nimbusds.jwt.SignedJWT
import com.vyatsu.lukoilweb.models.UserSecurity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.text.ParseException
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.stream.Collectors


@Service
class TokenService(private val jwtEncoder: JwtEncoder) {
    fun generateAccessToken(usrDetails: UserSecurity): String {
        val now = Instant.now()
        val scope: String = usrDetails.authorities
            .stream()
            .map { obj: GrantedAuthority -> obj.authority }
            .collect(Collectors.joining(" "))
        val claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(Instant.now())
            .expiresAt(now.plus(60, ChronoUnit.MINUTES))
            .subject(usrDetails.username)
            .claim("authorities", scope)
            .build()
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }
    fun generateRefreshToken(usrDetails: UserSecurity): String {
        val now = Instant.now()
        val scope = usrDetails.authorities.stream()
            .map { obj: GrantedAuthority -> obj.authority }
            .collect(Collectors.joining(" "))
        val claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plus(12, ChronoUnit.MONTHS))
            .subject(usrDetails.username)
            .claim("authorities", scope)
            .build()
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }
    fun parseToken(token: String?): String? {
        try {
            val decodedJWT = SignedJWT.parse(token)
            return decodedJWT.jwtClaimsSet.subject
        } catch (e: ParseException) {
            e.printStackTrace()
        }
        return null
    }
}