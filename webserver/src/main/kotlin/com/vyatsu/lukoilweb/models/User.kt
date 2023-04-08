package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    val id: Int,
    @Column(name = "user_login")
    val login: String,
    @Column(name = "user_password")
    val password: String,
    @Column(name = "User_role")
    val role: String
)
