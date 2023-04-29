package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Int> {
    fun getUserByLoginAndPassword(login: String, password: String) : User?
}