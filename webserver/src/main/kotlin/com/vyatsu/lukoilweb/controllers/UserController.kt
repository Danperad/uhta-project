package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.AuthModel
import com.vyatsu.lukoilweb.models.UserModel
import com.vyatsu.lukoilweb.services.UserService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(private val userService: UserService) {
    @PostMapping("auth", produces = ["application/json"])
    fun authUser(authModel: AuthModel) : UserModel?{
        return userService.getAuth(authModel)
    }
}