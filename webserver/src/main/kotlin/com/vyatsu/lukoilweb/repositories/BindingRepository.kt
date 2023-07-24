package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Binding
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface BindingRepository : CrudRepository<Binding, Int>