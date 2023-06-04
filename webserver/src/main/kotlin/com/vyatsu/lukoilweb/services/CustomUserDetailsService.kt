package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.UserSecurity
import com.vyatsu.lukoilweb.repositories.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails {
        if (username == null) return null
        val user = userRepository.getUserByLogin(username) ?: throw UsernameNotFoundException("$username not found")
        return UserSecurity(
            user.id!!,
            user.login,
            user.password,
            mutableListOf(SimpleGrantedAuthority(user.role.value))
        )
    }
}