package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.utils.RoleConverter
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
    @Convert(converter = RoleConverter::class)
    val role: Roles,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    var id: Int? = null
) {
    fun mapToUserDTO() = UserDTO(id!!, login, lastName, firstName, middleName)
    fun mapToUserSecurity() = UserSecurity(id!!, login, password, role.getListOfAuthority())
}
