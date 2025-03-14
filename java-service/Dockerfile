# Build Stage
FROM maven:3.8.4-openjdk-17 AS build
 
WORKDIR /app
 
# Copy only pom.xml first to leverage Docker cache
COPY pom.xml .
 
# Download dependencies
RUN mvn dependency:go-offline -B
 
# Copy the complete project
COPY . .
 
# Package the application
RUN mvn package -DskipTests
 
# Runtime Stage
FROM openjdk:17-jdk-slim
 
WORKDIR /app
 
COPY --from=build /app/target/*.jar app.jar
 
EXPOSE 8080
 
CMD ["java", "-jar", "app.jar"]