package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.application.*
import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.repositories.*
import com.vyatsu.lukoilweb.utils.ApplicationStatusConverter
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.ClassPathResource
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.ByteArrayOutputStream
import java.text.DateFormat
import java.time.Duration
import java.util.*


@Service
class ApplicationService(
    private val applicationRepository: ApplicationRepository,
    private val deviceRepository: DeviceRepository,
    private val consumableRepository: ConsumableRepository,
    private val applicationConsumableRepository: ApplicationConsumableRepository,
    private val applicationDeviceRepository: ApplicationDeviceRepository,
    private val dateFormat: DateFormat
) {
    @Transactional
    fun getAllApplications(limit: Pageable,
                           inArchive: Boolean,
                           search: String?,
                           status: String?,
                           startDate: String?,
                           endDate: String?,): Set<ApplicationDTO> {
        val applications = if (search == null && status == null && startDate == null && endDate == null) {
            if(inArchive){
                applicationRepository.findAllByInArchiveTrueAndIsDeletedFalse(limit)
            }else{
                applicationRepository.findAllByInArchiveFalseAndIsDeletedFalse(limit)
            }
        } else {
            applicationRepository.findAllBySearch(
                limit,
                search,
                inArchive,
                if(status == null){
                    null
                }else{
                    ApplicationStatusConverter().convertToEntityAttribute(status)
                },
                if(startDate == null){
                    null
                }else{
                    dateFormat.parse(startDate)
                },
                if(endDate == null){
                    null
                }else{
                    dateFormat.parse(endDate)
                }
            )
        }
        return applications.map { it.mapToApplicationDTO() }.toSet()
    }

    @Transactional
    fun getApplicationById(id: Int): ApplicationDTO? {
        return applicationRepository.findApplicationByNumber(id)?.mapToApplicationDTO()
    }

    @Transactional
    fun saveApplication(applicationDTO: ApplicationDTO): ApplicationDTO {
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
            number = applicationDTO.number,
            inArchive = false
        )
        val newApplication = applicationRepository.save(application);

        if (applicationDTO.devices.any { it.device.id == null } || applicationDTO.consumables.any { it.consumable.id == null })
            TODO()
        val devices = applicationDTO.devices.map {
            val binding = applicationDeviceRepository.findById(ApplicationDeviceKey(it.device.id, newApplication.number))
            if(!binding.isPresent){
                applicationDeviceRepository.save(
                    ApplicationDevice(
                        device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(it.device.csss) ?: TODO(),
                        application = newApplication,
                        deviceCount = it.count
                    )
                )
            }
            else{
                applicationDeviceRepository.save(binding.get().copy(deviceCount = it.count))
            }

        }
        val consumables = applicationDTO.consumables.map {
            val binding = applicationConsumableRepository.findById(ApplicationConsumableKey(it.consumable.id, newApplication.number))
            if(!binding.isPresent){
                applicationConsumableRepository.save(
                    ApplicationConsumable(
                        consumable = consumableRepository.findConsumableByCsssAndIsDeletedFalse(it.consumable.csss)
                            ?: TODO(),
                        application = newApplication,
                        consumableCount = it.count
                    )
                )
            }
            else{
                applicationConsumableRepository.save(binding.get().copy(consumableCount = it.count))
            }

        }
        newApplication.devices.clear()
        newApplication.consumables.clear()
        newApplication.devices.addAll(devices)
        newApplication.consumables.addAll(consumables)
        val test = applicationRepository.save(newApplication)
        return test.mapToApplicationDTO()
    }

    @Transactional
    fun getXlsxApplication(number: Int): ByteArrayResource? {
        val application = applicationRepository.findApplicationByNumber(number) ?: return null
        val resource = ClassPathResource("templates/applicationTemplate.xlsx").inputStream
        val workbook = XSSFWorkbook(resource)
        val sheet = workbook.getSheetAt(0)
        var counter = 1
        application.devices.forEach {
            val row = sheet.createRow(sheet.lastRowNum + 1)
            row.createCell(0).setCellValue(counter.toDouble())
            row.createCell(1).setCellValue(it.device.csss.toDouble())
            row.createCell(2).setCellValue(it.device.nr.toDouble())
            row.createCell(3).setCellValue(it.device.title)
            row.createCell(4).setCellValue(it.device.unitOfMeasurement.value)
            row.createCell(5).setCellValue(it.deviceCount.toDouble())
            row.createCell(6).setCellValue(dateFormat.format(it.application.date))
            counter++
        }
        application.consumables.forEach {
            val row = sheet.createRow(sheet.lastRowNum + 1)
            row.createCell(0).setCellValue(counter.toDouble())
            row.createCell(1).setCellValue(it.consumable.csss.toDouble())
            row.createCell(2).setCellValue(it.consumable.nr.toDouble())
            row.createCell(3).setCellValue(it.consumable.title)
            row.createCell(4).setCellValue(it.consumable.unitOfMeasurement.value)
            row.createCell(5).setCellValue(it.consumableCount.toDouble())
            row.createCell(6).setCellValue(dateFormat.format(it.application.date))
            counter++
        }
        val outputStream = ByteArrayOutputStream()
        workbook.write(outputStream)
        return ByteArrayResource(outputStream.toByteArray())
    }
    @Transactional
    fun archiveApplicationById(id: Int): Boolean {
        val application = applicationRepository.findApplicationByNumber(id)
            ?.copy(inArchive = true) ?: return false
        return try {
            applicationRepository.save(application).inArchive
        } catch (e: Exception) {
            false
        }
    }
    @Transactional
    fun deleteApplication(id: Int): Boolean {
        val application = applicationRepository.findApplicationByNumber(id)
            ?.copy(isDeleted = true) ?: return false
        return try {
            applicationRepository.save(application).isDeleted
        } catch (e: Exception) {
            false
        }
    }
    @Transactional
    fun unarchiveApplicationById(id: Int): Boolean {
        val application = applicationRepository.findApplicationByNumber(id)
            ?.copy(inArchive = false) ?: return false
        return try {
            applicationRepository.save(application).inArchive
        } catch (e: Exception) {
            false
        }
    }
}