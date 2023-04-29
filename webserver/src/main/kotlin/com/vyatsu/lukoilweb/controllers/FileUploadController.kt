package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.services.FileService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/files")
class FileUploadController(private val fileService: FileService) {

    @PostMapping("upload", produces = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadXlsFile(@RequestParam(name = "file") file: MultipartFile): ResponseEntity<String> {
        return try {
            fileService.addToDatabaseFromFile(file)
            ResponseEntity.ok().body("Added")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Don't added")
        }
    }
}