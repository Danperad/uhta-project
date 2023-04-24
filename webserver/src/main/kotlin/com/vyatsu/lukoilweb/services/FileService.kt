package com.vyatsu.lukoilweb.services

import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class FileService {
    fun loadResFromFile(file: MultipartFile) : Map<Int, List<String>> {
        val workbook = XSSFWorkbook(file.inputStream)
        val sheet = workbook.getSheetAt(0)
        val map = mutableMapOf<Int, List<String>>()
        var i = 0
        sheet.forEach {
            val list = mutableListOf<String>()
            it.forEach { cell ->
                when (cell.cellType){
                    CellType.STRING -> list.add(cell.stringCellValue)
                    CellType.NUMERIC -> list.add(cell.numericCellValue.toString())
                    else -> {}
                }
            }
            map[i] = list.toList()
            i++
        }
        return map.toMap()
    }
    fun createFileFromData() {

    }
}