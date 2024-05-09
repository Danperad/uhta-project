package com.vyatsu.lukoilweb

import com.vyatsu.lukoilweb.models.Binding
import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.models.UnitTypes
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.domain.PageRequest

@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RepositoriesTests {
    @Autowired
    private lateinit var consumableRepository: ConsumableRepository

    @Autowired
    private lateinit var deviceRepository: DeviceRepository

    @BeforeAll
    fun setUp() {
        val devices = listOf(
            Device(1, 1, "Тестовый Прибор 1", "Тест", UnitTypes.PC),
            Device(2, 2, "Тестовый Прибор 2", "Тест", UnitTypes.PC),
        )
        val newDevices = deviceRepository.saveAll(devices)
        val consumables = listOf(
            Consumable(1, 1, "Тестовый Расходник 1", "Тест", UnitTypes.PC),
            Consumable(2, 2, "Тестовый Расходник 2", "Тест", UnitTypes.PC),
        )
        consumables[0].devices.add(Binding(newDevices[0], consumables[0], 1))
        consumableRepository.saveAll(consumables)

    }

    @Test
    fun gettingAllDevices() {
        val devices = deviceRepository.findAllByIsDeletedFalseOrderByIdDesc(PageRequest.of(0, 20))
        assert(devices.size == 2)
    }

    @Test
    fun gettingAllConsumables() {
        val consumables = consumableRepository.findAllByIsDeletedFalseOrderByIdDesc(PageRequest.of(0, 20))
        assert(consumables.size == 2)
    }

    @Test
    fun addingDevice() {
        val device = Device(3, 3, "Тестовый Прибор 3", "Тест", UnitTypes.PC)
        val newDevice = deviceRepository.save(device)
        assert(newDevice.id != null)
    }

    @Test
    fun addBindingConsumable() {
        val consumable = Consumable(3, 3, "Тестовый Расходник", "Тест", UnitTypes.PC)
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(2)
        consumable.devices.add(Binding(device!!, consumable, 1))
        val newConsumable = consumableRepository.save(consumable)
        assert(newConsumable.devices.any { it.device.csss == device.csss })
    }
}