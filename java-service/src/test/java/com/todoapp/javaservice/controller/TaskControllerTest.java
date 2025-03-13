package com.todoapp.javaservice.controller;

import com.todoapp.javaservice.model.Task;
import com.todoapp.javaservice.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskController taskController;

    private Task createTask(Long id, String title, String description, Long categoryId) {
        Task task = new Task();
        task.setId(id);
        task.setTitle(title);
        task.setDescription(description);
        task.setCategoryId(categoryId);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return task;
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void healthCheck() {
        ResponseEntity<Map<String, String>> response = taskController.healthCheck();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
    }

    @Test
    void getAllTasks() {
        // Prepare test data
        List<Task> tasks = new ArrayList<>();
        tasks.add(createTask(1L, "Task 1", "Description 1", 1L));
        tasks.add(createTask(2L, "Task 2", "Description 2", 2L));
        
        // Mock repository behavior
        when(taskRepository.findAll()).thenReturn(tasks);
        
        // Call the method
        ResponseEntity<List<Task>> response = taskController.getAllTasks();
        
        // Verify the results
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("Task 1", response.getBody().get(0).getTitle());
        assertEquals("Task 2", response.getBody().get(1).getTitle());
        
        // Verify repository was called
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void createTask() {
        // Prepare test data
        Task taskToCreate = createTask(null, "New Task", "New Description", 1L);
        Task createdTask = createTask(1L, "New Task", "New Description", 1L);
        
        // Mock repository behavior
        when(taskRepository.save(any(Task.class))).thenReturn(createdTask);
        
        // Call the method
        ResponseEntity<Task> response = taskController.createTask(taskToCreate);
        
        // Verify the results
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("New Task", response.getBody().getTitle());
        
        // Verify repository was called
        verify(taskRepository, times(1)).save(any(Task.class));
    }
}
