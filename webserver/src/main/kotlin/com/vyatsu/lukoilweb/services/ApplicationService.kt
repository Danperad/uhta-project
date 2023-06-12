package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.application.*
import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import com.vyatsu.lukoilweb.utils.ApplicationStatusConverter
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.util.*

@Service
class ApplicationService(
    private val applicationRepository: ApplicationRepository,
    private val deviceRepository: DeviceRepository,
    private val consumableRepository: ConsumableRepository
) {
    @Transactional
    fun getAllApplications(): Set<ApplicationDTO> {
        return applicationRepository.findAll().map { it.mapToApplicationDTO() }.toSet()
    }

    @Transactional
    fun getApplicationById(id: Int): ApplicationDTO? {
        return applicationRepository.findApplicationByNumber(id)?.mapToApplicationDTO()
    }

    @Transactional
    fun saveApplication(applicationDTO: ApplicationDTO) : ApplicationDTO {
        val period = if (applicationDTO.period != null) {
            Duration.ofSeconds(applicationDTO.period)
        } else {
            null
        }
        val application = Application(
            Date(applicationDTO.date),
            applicationDTO.title,
            period,
            ApplicationStatusConverter().convertToEntityAttribute(applicationDTO.status),
            number = applicationDTO.number
        )
        if (applicationDTO.devices.any { it.device.id == null } || applicationDTO.consumables.any { it.consumable.id == null })
            TODO()
        val devices = applicationDTO.devices.map {
            ApplicationDevice(
                ApplicationDeviceKey(it.device.id!!, 0),
                deviceRepository.findDeviceByCsssAndIsDeletedFalse(it.device.csss) ?: TODO(),
                application,
                it.count
            )
        }
        val consumables = applicationDTO.consumables.map {
            ApplicationConsumable(
                ApplicationConsumableKey(it.consumable.id!!, 0),
                consumableRepository.findConsumableByCsssAndIsDeletedFalse(it.consumable.csss) ?: TODO(),
                application,
                it.count
            )
        }
        application.devices.addAll(devices)
        application.consumables.addAll(consumables)
        return applicationRepository.save(application).mapToApplicationDTO()
    }
}