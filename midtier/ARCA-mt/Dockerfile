FROM maven:3.6.0-jdk-11-slim AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
COPY --from=build /app/target/ARCA-mt-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]