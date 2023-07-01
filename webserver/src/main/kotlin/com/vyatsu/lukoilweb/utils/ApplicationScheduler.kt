package com.vyatsu.lukoilweb.utils

import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import jakarta.annotation.PostConstruct
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import org.springframework.scheduling.support.CronTrigger
import org.springframework.stereotype.Component

@Component
class ApplicationScheduler(
    private val taskScheduler: ThreadPoolTaskScheduler,
    private val cronTrigger: CronTrigger,
    private val applicationRepository: ApplicationRepository
) {
    @PostConstruct
    fun scheduleRunnable() {
        taskScheduler.schedule(ApplicationTaskRunner(applicationRepository), cronTrigger)
    }

    open class ApplicationTaskRunner(private val applicationRepository: ApplicationRepository) : Runnable{
        override fun run() {
            ApplicationTaskAsync(applicationRepository).runPeriodApplication()
        }
    }
}