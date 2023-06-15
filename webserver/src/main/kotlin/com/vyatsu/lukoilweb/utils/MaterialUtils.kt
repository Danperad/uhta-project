package com.vyatsu.lukoilweb.utils

import com.vyatsu.lukoilweb.models.MaterialBase
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root

fun <T : MaterialBase> preparePredicate(
    query: CriteriaQuery<T>,
    materialRoot: Root<T>,
    search: String,
    cb: CriteriaBuilder
): CriteriaQuery<T> {
    val titleSearch = cb.like(materialRoot.get("title"), "%$search%")
    val isDeleted = cb.isFalse(materialRoot.get("isDeleted"))
    val intSearch = search.toIntOrNull()
    if (intSearch != null) {
        val csssSearch = cb.equal(materialRoot.get<Int>("csss"), intSearch)
        val nrSearch = cb.equal(materialRoot.get<Int>("nr"), intSearch)
        val resultPredicate = cb.or(titleSearch, csssSearch, nrSearch)
        query.where(
            cb.and(isDeleted, resultPredicate)
        )
    } else {
        query.where(cb.and(isDeleted, titleSearch))
    }
    return query
}