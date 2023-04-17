FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

EXPOSE 8081/tcp
COPY build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]