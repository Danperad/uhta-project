package com.vyatsu.lukoilweb

import com.vyatsu.lukoilweb.models.Binding
import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.models.UnitTypes
import com.vyatsu.lukoilweb.models.dto.BindingDTO
import com.vyatsu.lukoilweb.models.dto.ConsumableDTO
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import com.vyatsu.lukoilweb.services.ConsumableService
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.transaction.annotation.Transactional

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ConsumableServiceTests {
    @Autowired
    private lateinit var consumableService: ConsumableService

    @Autowired
    private lateinit var consumableRepository: ConsumableRepository

    @Autowired
    private lateinit var deviceRepository: DeviceRepository

    @BeforeAll
    @Transactional
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
    @Transactional
    fun addConsumableWithBinding() {
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(1)!!.mapToDeviceDTO()
        val consumable =
            ConsumableDTO(null, "Расходник 3", "Тест", 3, 3, "ШТ", 0, 0, setOf(BindingDTO(null, device, null, 0)))
        val newConsumable = consumableService.saveConsumable(consumable)
        assert(newConsumable != null)
        assert(newConsumable!!.devices.isNotEmpty())
        assert(newConsumable.devices.first().device!= null)
        val aaa = consumableService.saveConsumable(newConsumable.copy(devices = setOf()))
        assert(aaa != null)
        assert(aaa!!.devices.isEmpty())
    }
}