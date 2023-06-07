package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.models.UnitTypeConverter
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Service
class FileService(
    private val deviceRepository: DeviceRepository,
    private val deviceService: DeviceService,
    private val consumableService: ConsumableService
) {
    @Transactional
    fun addToDatabaseFromFile(file: MultipartFile) {
        val workbook = XSSFWorkbook(file.inputStream)
        val sheet = workbook.getSheetAt(0)
        val preparedDevices = mutableListOf<Device>()
        sheet.filter { it.getCell(5).cellType == CellType.STRING && it.getCell(5).stringCellValue == "Прибор" }
            .forEach {
                preparedDevices.add(getDeviceFromRow(it))
            }
        preparedDevices.forEach { deviceService.saveDevice(it.mapToDeviceDTO()) }
        val preparedConsumables = mutableListOf<Consumable>()
        sheet.filter { it.getCell(5).cellType == CellType.STRING && it.getCell(5).stringCellValue == "Расходник" }
            .forEach {
                preparedConsumables.add(getConsumableFromRow(it))
            }
        preparedConsumables.forEach { consumableService.saveConsumable(it.mapToConsumableDTO()) }
    }

    private fun getDeviceFromRow(row: Row): Device {
        val csss = row.getCell(1).numericCellValue.toInt()
        val nr3 = row.getCell(2).numericCellValue.toInt()
        val title = row.getCell(3).stringCellValue
        val producer = row.getCell(4).stringCellValue
        val number = row.getCell(6).numericCellValue.toInt()
        val unitType = UnitTypeConverter().convertToEntityAttribute(row.getCell(7).stringCellValue)
        return Device(csss, nr3, title, producer, unitType, inStock = number)
    }

    private fun getConsumableFromRow(row: Row): Consumable {
        val csss = row.getCell(1).numericCellValue.toInt()
        val nr3 = row.getCell(2).numericCellValue.toInt()
        val title = row.getCell(3).stringCellValue
        val producer = row.getCell(4).stringCellValue
        val number = row.getCell(6).numericCellValue.toInt()
        val unitType = UnitTypeConverter().convertToEntityAttribute(row.getCell(7).stringCellValue)
        val parent = row.getCell(8).numericCellValue.toInt()
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(parent) ?: throw Exception()
        return Consumable(csss, nr3, title, producer, unitType, devices = mutableListOf(device), inStock = number)
    }
}