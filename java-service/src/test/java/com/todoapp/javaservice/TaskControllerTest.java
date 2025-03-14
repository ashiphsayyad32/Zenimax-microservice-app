package com.todoapp.javaservice;

import com.todoapp.javaservice.controller.TaskController;
import com.todoapp.javaservice.model.Task;
import com.todoapp.javaservice.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the TaskController class.
 * 
 * These tests verify the functionality of the TaskController endpoints using Mockito
 * to mock the TaskRepository dependency. This allows testing the controller logic
 * in isolation without requiring a database connection.
 * 
 * The tests cover:
 * - Getting all tasks
 * - Creating a new task
 * - Health check endpoint
 */
@ExtendWith(MockitoExtension.class)
public class TaskControllerTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskController taskController;

    /**
     * Test the getAllTasks endpoint.
     * 
     * Verifies that:
     * - The controller returns HTTP 200 OK status
     * - The correct number of tasks is returned
     * - The repository's findAll method is called exactly once
     */
    @Test
    public void testGetAllTasks() {
        // Arrange
        Task task1 = new Task(1L, "Task 1", "Description 1", 1L, LocalDateTime.now(), LocalDateTime.now());
        Task task2 = new Task(2L, "Task 2", "Description 2", 1L, LocalDateTime.now(), LocalDateTime.now());
        List<Task> mockTasks = Arrays.asList(task1, task2);
        
        when(taskRepository.findAll()).thenReturn(mockTasks);

        // Act
        ResponseEntity<List<Task>> response = taskController.getAllTasks();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(taskRepository, times(1)).findAll();
    }

    /**
     * Test the createTask endpoint.
     * 
     * Verifies that:
     * - The controller returns HTTP 201 CREATED status
     * - The returned task has the expected ID and title
     * - The repository's save method is called exactly once
     */
    @Test
    public void testCreateTask() {
        // Arrange
        Task taskToCreate = new Task(null, "New Task", "New Description", 1L, null, null);
        Task savedTask = new Task(1L, "New Task", "New Description", 1L, LocalDateTime.now(), LocalDateTime.now());
        
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        ResponseEntity<Task> response = taskController.createTask(taskToCreate);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("New Task", response.getBody().getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test the health check endpoint.
     * 
     * Verifies that:
     * - The controller returns HTTP 200 OK status
     * - The response contains the expected "UP" status
     */
    @Test
    public void testHealthCheck() {
        // Act
        ResponseEntity<Map<String, String>> response = taskController.healthCheck();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("UP", response.getBody().get("status"));
    }
}
