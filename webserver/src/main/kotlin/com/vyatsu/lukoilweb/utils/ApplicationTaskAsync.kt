package com.vyatsu.lukoilweb.utils

import com.vyatsu.lukoilweb.models.application.*
import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import org.springframework.scheduling.annotation.Async
import java.time.LocalDate
import java.time.ZoneId
import java.util.Calendar
import java.util.Date

open class ApplicationTaskAsync(private val applicationRepository: ApplicationRepository) {

    @Async("threadPoolTaskExecutor")
    open fun runPeriodApplication(){
        val applications = applicationRepository.findAllByPeriodNotNull().filter {
            val calendar = Calendar.getInstance()
            calendar.time = it.date
            calendar.add(Calendar.DATE, it.period!!.toDays().toInt())
            val zid = calendar.timeZone?.toZoneId() ?: ZoneId.systemDefault()
            LocalDate.now() >= LocalDate.ofInstant(calendar.toInstant(), zid)
        }
        if (applications.isEmpty())
            return
        val newApplications = applications.map {
            val news = it.copy(number = null, status = ApplicationStatuses.NEW, date = Date())
            news.apply {
                val newDevices = updateDevices(it)
                it.devices.clear()
                it.devices.addAll(newDevices)
                val newConsumables = updateConsumables(it)
                it.consumables.clear()
                it.consumables.addAll(newConsumables)
            }
        }
        applications.forEach {
            it.period = null
        }
        applicationRepository.saveAll(applications)
        applicationRepository.saveAll(newApplications)
    }

    private fun updateDevices(application: Application): MutableList<ApplicationDevice> {
        return application.devices.map {
            it.copy(
                deviceKey = ApplicationDeviceKey(),
                application = application
            )
        }.toMutableList()
    }

    private fun updateConsumables(application: Application): MutableList<ApplicationConsumable> {
        return application.consumables.map {
            it.copy(
                consumableKey = ApplicationConsumableKey(),
                application = application
            )
        }.toMutableList()
    }
}