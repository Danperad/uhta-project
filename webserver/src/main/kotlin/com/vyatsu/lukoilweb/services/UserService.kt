package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.AuthModel
import com.vyatsu.lukoilweb.models.UserDTO
import com.vyatsu.lukoilweb.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {
    fun getAuth(authModel: AuthModel) : UserDTO? {
        val user = userRepository.getUserByLoginAndPassword(authModel.login, authModel.password) ?: return null
        return user.mapToUserDTO()
    }
}