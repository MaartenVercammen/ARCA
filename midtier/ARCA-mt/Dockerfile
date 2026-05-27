FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
COPY --from=build /app/target/ACRA-mt-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]