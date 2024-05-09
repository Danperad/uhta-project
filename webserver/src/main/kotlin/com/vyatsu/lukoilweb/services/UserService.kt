package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.models.dto.NewUserDTO
import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.repositories.UserRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(private val userRepository: UserRepository) {
    fun getAuth(authModel: AuthModel) : UserDTO? {
        val user = userRepository.getUserByLoginAndPassword(authModel.login, authModel.password) ?: return null
        return user.mapToUserDTO()
    }

    @Transactional
    fun saveUser(userDTO: NewUserDTO): UserDTO {
        val user = userDTO.mapToUser()
        val oldUser = userRepository.getUserByLogin(user.login)
        if ((user.id == null || user.id == 0) && oldUser != null)
            TODO()

        return userRepository.save(user).mapToUserDTO()
    }
    @Transactional
    fun findAllUsersPage(limit: Pageable, search: String?): Set<UserDTO> {
        val users = userRepository.findAllByIsDeletedFalseOrderByIdDesc(limit)

        return users.map { it.mapToUserDTO() }.toSet()
    }
}