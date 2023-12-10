package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.application.Application
import com.vyatsu.lukoilweb.models.application.ApplicationStatuses
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.*


interface ApplicationRepositoryCustom {
    fun findAllBySearch(limit: Pageable,
                        search: String?,
                        inArchive: Boolean,
                        status: ApplicationStatuses?,
                        startDate: Date?,
                        endDate: Date?) : Page<Application>
}