package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.AuthResponse
import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.repositories.UserRepository
import com.vyatsu.lukoilweb.security.JwtService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthorizationService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager
) {
    fun login(authModel: AuthModel): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(authModel.login, authModel.password)
        )
        val user = userRepository.getUserByLoginAndPassword(authModel.login, authModel.password)
            ?: throw UsernameNotFoundException("User not found !")
        val jwtToken = jwtService.generateToken(user.mapToUserSecurity())
        return AuthResponse(jwtToken)
    }
}