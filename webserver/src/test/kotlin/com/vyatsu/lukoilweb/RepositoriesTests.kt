package com.vyatsu.lukoilweb

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import jakarta.annotation.PostConstruct
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.domain.PageRequest

@DataJpaTest
class RepositoriesTests {
    @Autowired
    private lateinit var consumableRepository: ConsumableRepository

    @Autowired
    private lateinit var deviceRepository: DeviceRepository

    @PostConstruct
    fun setUp() {
        val devices = listOf(
            Device(1,1,"Тестовый Прибор 1", "Тест", "ШТ"),
            Device(2,2,"Тестовый Прибор 2", "Тест", "ШТ"),
        )
        val consumables = listOf(
            Consumable(1,1,"Тестовый Расходник 1", "Тест", "ШТ"),
            Consumable(1,1,"Тестовый Расходник 2", "Тест", "ШТ"),
        )
        val addedConsumables = consumableRepository.saveAll(consumables)
        val addedDevices = deviceRepository.saveAll(devices)
        addedDevices[1].consumables.add(addedConsumables[1])
        deviceRepository.save(addedDevices[1])
    }
    @Test
    fun gettingAllDevices(){
        val devices = deviceRepository.findAllByIsDeletedFalse(PageRequest.of(0, 20))
        assert(devices.size==2)
    }
}