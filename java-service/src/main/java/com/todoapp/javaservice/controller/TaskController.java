package com.todoapp.javaservice.controller;

import com.todoapp.javaservice.model.Task;
import com.todoapp.javaservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TaskController handles all API endpoints related to tasks in the Todo application.
 * This controller is part of the Java microservice responsible for task management.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Retrieves all tasks from the database.
     * 
     * @return ResponseEntity containing a list of all tasks
     */
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        // Get all tasks from the repository
        List<Task> tasks = taskRepository.findAll();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    /**
     * Creates a new task in the database.
     * 
     * @param task The task object to be created
     * @return ResponseEntity containing the created task
     */
    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        // Save the task to the repository
        Task savedTask = taskRepository.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    /**
     * Health check endpoint to verify the service is running.
     * Returns a standard format with "UP" status for consistency across microservices.
     * 
     * @return ResponseEntity with service status information
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
