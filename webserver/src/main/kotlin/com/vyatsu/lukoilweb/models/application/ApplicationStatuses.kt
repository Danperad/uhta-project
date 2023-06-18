package com.vyatsu.lukoilweb.models.application

enum class ApplicationStatuses(val value: String) {
    NEW("Новая"),
    ON_APPROVAL("На согласование"),
    AGREED("Согласована")
}