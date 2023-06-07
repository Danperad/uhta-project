package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.repositories.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails {
        if (username == null) throw UsernameNotFoundException("User not found")
        val user = userRepository.getUserByLogin(username) ?: throw UsernameNotFoundException("User not found")
        return user.mapToUserSecurity()
    }
}