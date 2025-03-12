package com.todoapp.javaservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Bean
    public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println("Checking database connection...");
            try {
                String dbName = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
                System.out.println("Connected to database: " + dbName);
                
                // Verify tasks table exists or create it
                jdbcTemplate.execute("""
                    CREATE TABLE IF NOT EXISTS tasks (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        category_id INT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                """);
                System.out.println("Tasks table initialized");
            } catch (Exception e) {
                System.err.println("Database connection failed: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
