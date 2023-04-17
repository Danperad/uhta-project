package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.User

@org.springframework.stereotype.Repository
interface UserRepository : org.springframework.data.repository.Repository<User, Int> {
    fun getUserByLoginAndPassword(login: String, password: String) : User?
}