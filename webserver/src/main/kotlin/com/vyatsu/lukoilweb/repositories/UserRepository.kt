package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.User
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : org.springframework.data.repository.Repository<User, Int> {
    fun getUserByLoginAndPassword(login: String, password: String) : User?
}