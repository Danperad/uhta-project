package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.AuthModel
import com.vyatsu.lukoilweb.models.UserSecurity
import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.repositories.UserRepository
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) : UserDetailsService {
    fun getAuth(authModel: AuthModel): UserSecurity {
        val user = userRepository.getUserByLoginAndPassword(authModel.login, authModel.password)
            ?: throw UsernameNotFoundException("User not found !")
        return user.mapToUserSecurity()
    }

    override fun loadUserByUsername(username: String?): UserSecurity {
        if (username == null) throw UsernameNotFoundException("User not found !")
        val user = userRepository.getUserByLogin(username) ?: throw UsernameNotFoundException("User not found !")
        return user.mapToUserSecurity()
    }
}