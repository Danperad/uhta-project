package com.vyatsu.lukoilweb.utils

import org.springframework.boot.context.properties.ConfigurationProperties
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey

@ConfigurationProperties(prefix ="rsa")
data class RsaProperties(var privateKey: RSAPrivateKey? = null, var publicKey: RSAPublicKey? = null)
