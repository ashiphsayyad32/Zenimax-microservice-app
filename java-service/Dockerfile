FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

# Copy the Maven configuration files
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download all required dependencies
RUN mvn dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN mvn package -DskipTests

# Use a smaller JRE image for the runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
