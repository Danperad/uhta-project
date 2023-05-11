package com.vyatsu.lukoilweb

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.models.UnitTypes
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import jakarta.annotation.PostConstruct
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
            Device(1,1,"Тестовый Прибор 1", "Тест", UnitTypes.PC),
            Device(2,2,"Тестовый Прибор 2", "Тест", UnitTypes.PC),
        )
        val consumables = listOf(
            Consumable(1,1,"Тестовый Расходник 1", "Тест", UnitTypes.PC),
            Consumable(1,1,"Тестовый Расходник 2", "Тест", UnitTypes.PC),
        )
        consumableRepository.saveAll(consumables)
        deviceRepository.saveAll(devices)
    }
    @Test
    fun gettingAllDevices(){
        val devices = deviceRepository.findAllByIsDeletedFalse(PageRequest.of(0, 20))
        assert(devices.size==2)
    }
}