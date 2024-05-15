package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Logs
import com.vyatsu.lukoilweb.repositories.LogsRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.vyatsu.lukoilweb.models.dto.LogsDTO
import kotlinx.datetime.toJavaInstant

@Service
class LogsService(
    private val logsRepository: LogsRepository
) {
    @Transactional
    fun getAllLogs(limit: Pageable,
                   search: String?,
                   status: String?,
                   startDate: String?,
                   endDate: String?,): Set<LogsDTO>{
        val logs = if (search == null && status == null && startDate == null && endDate == null){
            logsRepository.findAllByOrderByDateDesc(limit)
        }
        else{
            logsRepository.findAllByOrderByDateDesc(limit)
            TODO()
        }
        return logs.map { it.mapToLogsDTO() }.toSet()
    }
    @Transactional
    fun addLog(logsDTO: LogsDTO): LogsDTO {
        val log = Logs(
            id = logsDTO.id,
            logsDTO.user_login,
            logsDTO.action,
            logsDTO.status,
            logsDTO.result,
            logsDTO.element_number,
            logsDTO.date.toJavaInstant()
        )
        val new_log = logsRepository.save(log)
        return  new_log.mapToLogsDTO()
    }
}
