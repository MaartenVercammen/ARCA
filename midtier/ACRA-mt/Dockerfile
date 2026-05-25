FROM openjdk:25
RUN mvn clean package
COPY target/ACRA-mt-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]