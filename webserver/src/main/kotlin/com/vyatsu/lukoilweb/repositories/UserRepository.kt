package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.User
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Int> {
    fun getUserByLoginAndPassword(login: String, password: String) : User?
}