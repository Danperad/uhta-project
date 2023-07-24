package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.AuthResponse
import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.services.AuthorizationService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(
    private val authorizationService: AuthorizationService
) {
    @PostMapping("auth", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun authUser(@RequestBody @Validated authModel: AuthModel): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(authorizationService.login(authModel))
    }
}