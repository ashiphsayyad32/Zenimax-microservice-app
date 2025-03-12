package com.todoapp.javaservice.repository;

import com.todoapp.javaservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Add custom query methods if needed
}
