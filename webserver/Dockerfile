FROM openjdk:17-alpine as build
WORKDIR /app

COPY gradle ./gradle
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY src ./src

RUN dos2unix gradlew
RUN ./gradlew build
RUN ./gradlew bootJar

FROM openjdk:17-alpine
VOLUME /tmp

EXPOSE 8080/tcp
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]