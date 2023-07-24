package com.vyatsu.lukoilweb.security

import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.boot.context.properties.ConfigurationProperties
import java.security.Key


@ConfigurationProperties(prefix ="secrets")
data class TokenSecret(var secret: String? = null){
    fun getKey() : Key{
        val keyBytes = Decoders.BASE64.decode(secret)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}
