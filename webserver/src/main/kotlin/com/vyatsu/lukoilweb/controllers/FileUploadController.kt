package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.services.FileService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("api/files")
class FileUploadController(private val fileService: FileService) {

    @PostMapping("upload")
    fun uploadXlsFile(@RequestParam(name = "file") file: MultipartFile): Map<Int, List<String>> {
        return fileService.loadResFromFile(file)
    }
}