package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.application.*
import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import com.vyatsu.lukoilweb.utils.ApplicationStatusConverter
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.ByteArrayOutputStream
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

    @Transactional
    fun getXlsxApplication(number: Int): ByteArrayResource? {
        val application = applicationRepository.findApplicationByNumber(number) ?: return null
        val resource = ClassPathResource("templates/applicationTemplate.xlsx").inputStream
        val workbook = XSSFWorkbook(resource)
        val sheet = workbook.getSheetAt(0)
        var counter = 1
        application.devices.forEach {
            val row = sheet.createRow(sheet.lastRowNum+1)
            row.createCell(0).setCellValue(counter.toDouble())
            row.createCell(1).setCellValue(it.device.csss.toDouble())
            row.createCell(2).setCellValue(it.device.nr.toDouble())
            row.createCell(3).setCellValue(it.device.title)
            row.createCell(4).setCellValue(it.device.unitOfMeasurement.value)
            row.createCell(5).setCellValue(it.deviceCount.toDouble())
            row.createCell(6).setCellValue(it.application.date)
            counter++
        }
        application.consumables.forEach {
            val row = sheet.createRow(sheet.lastRowNum+1)
            row.createCell(0).setCellValue(counter.toDouble())
            row.createCell(1).setCellValue(it.consumable.csss.toDouble())
            row.createCell(2).setCellValue(it.consumable.nr.toDouble())
            row.createCell(3).setCellValue(it.consumable.title)
            row.createCell(4).setCellValue(it.consumable.unitOfMeasurement.value)
            row.createCell(5).setCellValue(it.consumableCount.toDouble())
            row.createCell(6).setCellValue(it.application.date)
            counter++
        }
        val outputStream = ByteArrayOutputStream()
        workbook.write(outputStream)
        return ByteArrayResource(outputStream.toByteArray())
    }
}