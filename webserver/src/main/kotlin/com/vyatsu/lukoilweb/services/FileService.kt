package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Service
class FileService(
    private val deviceRepository: DeviceRepository,
    private val consumableRepository: ConsumableRepository
) {
    @Transactional
    fun addToDatabaseFromFile(file: MultipartFile) {
        val workbook = XSSFWorkbook(file.inputStream)
        val sheet = workbook.getSheetAt(0)
        val preparedDevices = mutableListOf<Device>()
        sheet.filter { it.getCell(6).stringCellValue == "Прибор" }.forEach {
            preparedDevices.add(getDeviceFromRow(it))
        }
        deviceRepository.saveAll(preparedDevices)
        val preparedConsumables = mutableListOf<Consumable>()
        sheet.filter { it.getCell(6).stringCellValue == "Расходник" }.forEach {
            preparedConsumables.add(getConsumableFromRow(it))
        }
        consumableRepository.saveAll(preparedConsumables)
    }

    private fun getDeviceFromRow(row: Row): Device {
        val csss = row.getCell(2).numericCellValue.toInt()
        val nr3 = row.getCell(3).numericCellValue.toInt()
        val title = row.getCell(4).stringCellValue
        val producer = row.getCell(5).stringCellValue
        return Device(csss, nr3, title, producer, "ШТ")
    }

    private fun getConsumableFromRow(row: Row): Consumable {
        val csss = row.getCell(2).numericCellValue.toInt()
        val nr3 = row.getCell(3).numericCellValue.toInt()
        val title = row.getCell(4).stringCellValue
        val producer = row.getCell(5).stringCellValue
        val parent = row.getCell(8).numericCellValue.toInt()
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(parent) ?: throw Exception()
        return Consumable(csss, nr3, title, producer, "ШТ", devices = mutableListOf(device))
    }
}