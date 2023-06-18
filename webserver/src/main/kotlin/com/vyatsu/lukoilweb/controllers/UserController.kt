package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.services.UserService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(private val userService: UserService) {
    @PostMapping("auth", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun authUser(@RequestBody @Validated authModel: AuthModel) : ResponseEntity<UserDTO?> {
        val user = userService.getAuth(authModel)
        return if (user != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(user)
        } else {
            ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).build()
        }
    }
}