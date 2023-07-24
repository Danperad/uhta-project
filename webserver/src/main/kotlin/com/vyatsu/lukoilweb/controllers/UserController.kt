package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.AuthModel
import com.vyatsu.lukoilweb.models.AuthResponse
import com.vyatsu.lukoilweb.services.TokenService
import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.services.UserService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val authManager: AuthenticationManager
) {
    @PostMapping("auth", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun authUser(@RequestBody @Validated authModel: AuthModel): ResponseEntity<Any> {
        return try {
            val authenticationToken = UsernamePasswordAuthenticationToken(authModel.login, authModel.password)
            val auth = authManager.authenticate(authenticationToken)

            val user = userService.getAuth(authModel)
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(user)
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(AuthResponse(tokenService.generateAccessToken(user), tokenService.generateRefreshToken(user)))
        } catch (e: UsernameNotFoundException) {
            ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).build()
        }
    }

    @GetMapping("/refresh")
    fun refreshToken(request: HttpServletRequest): ResponseEntity<Any>  {
        val headerAuth = request.getHeader("Authorization")
        val refreshToken = headerAuth.substring(7, headerAuth.length)
        val email = tokenService.parseToken(refreshToken)
        val user = userService.loadUserByUsername(email)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
            .body(AuthResponse(tokenService.generateAccessToken(user), tokenService.generateRefreshToken(user)))
    }
}