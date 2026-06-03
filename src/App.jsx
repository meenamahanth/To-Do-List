import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
