package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.dto.LogsDTO
import jakarta.persistence.*
import kotlinx.datetime.toKotlinInstant
import java.time.Instant

@Entity
@Table(name = "logs")
class Logs(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id", nullable = false)
    var id: Int? = null,
    @Column(name = "user_login")
    val user_login: String,
    @Column(name = "action")
    val action: String,
    @Column(name = "log_status")
    val status: String,
    @Column(name = "result")
    val result: String,
    @Column(name = "element_number")
    var elementNumber: Int? = null,
    @Column(name = "log_date")
    val date: Instant
){
    fun mapToLogsDTO() = LogsDTO(id!!, user_login, action, status, result, elementNumber, date.toKotlinInstant())
}