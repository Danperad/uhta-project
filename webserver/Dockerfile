FROM arm64v8/eclipse-temurin:17-jre-ubi9-minimal

VOLUME /tmp

EXPOSE 8081/tcp
COPY build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]