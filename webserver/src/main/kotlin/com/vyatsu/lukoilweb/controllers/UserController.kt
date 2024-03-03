package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.dto.AuthModel
import com.vyatsu.lukoilweb.models.dto.UserDTO
import com.vyatsu.lukoilweb.models.dto.NewUserDTO
import com.vyatsu.lukoilweb.services.UserService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/user")
class UserController(private val userService: UserService) {
    private val logger = LoggerFactory.getLogger(UserController::class.java)
    @PostMapping("auth", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun authUser(@RequestBody @Validated authModel: AuthModel) : ResponseEntity<UserDTO?> {
        val user = userService.getAuth(authModel)
        return if (user != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(user)
        } else {
            ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).build()
        }
    }
    @PostMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun saveUser(@RequestBody @Validated userDTO: NewUserDTO) : ResponseEntity<UserDTO?> {
        logger.debug("Getting request post users {}", userDTO)
        val user = userService.saveUser(userDTO)
        return if (user != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    @GetMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllUsers(
        @RequestParam(required = false) start: Int?,
        @RequestParam(required = false) count: Int?,
        @RequestParam(required = false) search: String?
    ): ResponseEntity<Set<UserDTO>> {
        logger.debug("Getting request get all users with start=$start, count=$count, search=$search")
        val users = userService.findAllUsersPage(PageRequest.of(start ?: 0, count ?: 10), search)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(users)
    }
}