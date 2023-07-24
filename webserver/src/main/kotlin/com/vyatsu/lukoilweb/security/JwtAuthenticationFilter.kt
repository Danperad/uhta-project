package com.vyatsu.lukoilweb.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        if (header == null || !header.startsWith("Bearer ")){
            filterChain.doFilter(request, response)
            return
        }
        val jwt = header.substring(7)
        val username = jwtService.extractUsername(jwt)
        if (username == null || SecurityContextHolder.getContext().authentication != null){
            filterChain.doFilter(request, response)
            return
        }
        val userDetails = userDetailsService.loadUserByUsername(username)
        if (!jwtService.isTokenValid(jwt, userDetails)){
            filterChain.doFilter(request, response)
            return
        }
        val authToken = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authToken
    }
}