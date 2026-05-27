FROM maven:3.9.16-eclipse-temurin-25-alpine AS build
COPY src /app/src
COPY pom.xml /app
RUN mvn -f /app/pom.xml clean package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
COPY --from=build /app/target/ARCA-mt-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]