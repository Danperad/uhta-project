package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.AuthModel
import com.vyatsu.lukoilweb.models.UserModel
import com.vyatsu.lukoilweb.services.UserService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(private val userService: UserService) {
    @PostMapping("auth", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun authUser(authModel: AuthModel) : ResponseEntity<UserModel?> {
        val user = userService.getAuth(authModel)
        return if (user != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(user)
        } else {
            ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).build()
        }
    }
}