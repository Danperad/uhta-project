package com.vyatsu.lukoilweb.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import org.springframework.scheduling.support.CronTrigger
import java.util.concurrent.Executor


@Configuration
@EnableAsync
class ThreadPoolTaskSchedulerConfig {
    @Bean
    fun threadPoolTaskScheduler(): ThreadPoolTaskScheduler {
        val threadPoolTaskScheduler = ThreadPoolTaskScheduler()
        threadPoolTaskScheduler.poolSize = 5
        threadPoolTaskScheduler.setThreadNamePrefix("ThreadPoolTaskScheduler")
        return threadPoolTaskScheduler
    }
    @Bean
    fun cronTrigger() : CronTrigger = CronTrigger("0 0 0 * * ?")

    @Bean(name = ["threadPoolTaskExecutor"])
    fun threadPoolTaskExecutor(): Executor {
        return ThreadPoolTaskExecutor()
    }
}