package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "users")
class User(
    @Column(name = "user_login")
    val login: String,
    @Column(name = "user_password")
    val password: String,
    @Column(name = "last_name")
    val lastName: String,
    @Column(name = "first_name")
    val firstName: String,
    @Column(name = "middle_name")
    val middleName: String?,
    @Column(name = "user_role")
    val role: String,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    var id: Int? = null
) {
    fun toUserModel() = UserModel(id!!, login, lastName, firstName, middleName)
}
