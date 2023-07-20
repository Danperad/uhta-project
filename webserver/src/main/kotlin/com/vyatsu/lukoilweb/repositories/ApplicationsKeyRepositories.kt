package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.application.ApplicationConsumable
import com.vyatsu.lukoilweb.models.application.ApplicationConsumableKey
import com.vyatsu.lukoilweb.models.application.ApplicationDevice
import com.vyatsu.lukoilweb.models.application.ApplicationDeviceKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ApplicationConsumableRepository : JpaRepository<ApplicationConsumable, ApplicationConsumableKey>

@Repository
interface ApplicationDeviceRepository : JpaRepository<ApplicationDevice, ApplicationDeviceKey>
