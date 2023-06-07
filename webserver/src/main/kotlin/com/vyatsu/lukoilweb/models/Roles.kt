package com.vyatsu.lukoilweb.models

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

enum class Roles(val value: String) {
    ADMIN("ADMIN"),
    WORKER("WORKER");
    fun getListOfAuthority() : MutableCollection<GrantedAuthority>{
        return when (this){
            ADMIN -> mutableListOf(SimpleGrantedAuthority(ADMIN.value), SimpleGrantedAuthority(WORKER.value))
            WORKER -> mutableListOf(SimpleGrantedAuthority(WORKER.value))
        }
    }
}