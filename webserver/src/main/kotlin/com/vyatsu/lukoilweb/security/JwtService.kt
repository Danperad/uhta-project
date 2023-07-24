package com.vyatsu.lukoilweb.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*


@Service
class JwtService(secret: TokenSecret) {
    private val secret : Key
    init {
        this.secret = secret.getKey()
    }

    fun extractUsername(token: String): String? {
        return extractClaim(token) { obj: Claims -> obj.subject }
    }

    fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T) : T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }

    private fun extractAllClaims(token: String) : Claims {
        return Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJwt(token).body
    }
    fun generateToken(userDetails: UserDetails): String {
        return generateToken(HashMap(), userDetails)
    }

    fun generateToken(
        extraClaims: Map<String?, Any?>?,
        userDetails: UserDetails
    ): String {
        return Jwts
            .builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.username)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 24))
            .signWith(secret, SignatureAlgorithm.HS256)
            .compact()
    }

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return username == userDetails.username && !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { obj: Claims -> obj.expiration }
    }
}