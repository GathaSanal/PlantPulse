PlantPulse — Industrial Process Monitoring Dashboard

Project Overview

PlantPulse is a React-based industrial process monitoring dashboard designed to simulate and visualize operating conditions in water treatment systems.

The project combines industrial process monitoring concepts with modern frontend development. Users can monitor system readings, simulate process changes, identify abnormal conditions, and review historical events.

This project was developed as part of the ComIT React JS Final Project.

Features

Plant Dashboard: Monitor three industrial systems and their operating parameters.

Active Alerts: Identify readings classified as Warning or Critical.

Update Reading: Simulate changes to industrial process parameters.

Event History: View recorded changes, including previous values, updated values, and timestamps.

System Trends: Visualize historical changes in system operating status.

Data Persistence: Save readings and events using browser localStorage and JSONBin cloud storage.

Reset Demo: Restore the original system readings and clear recorded events.

Responsive Design: Support desktop and smaller screen layouts.

Systems Monitored

System

Parameters

Reverse Osmosis (RO) System

Pressure, Flow Rate, Conductivity

Cooling Water System

Temperature, pH, Conductivity

Storage Tank

Tank Level

Status Classification

PlantPulse classifies process readings into three categories:

Normal: The reading is within its configured operating range.

Warning: The reading is outside the normal range but within a 10% warning margin based on the normal range width.

Critical: The reading exceeds the warning limits.

The most severe reading determines the system status, and the most severe system status determines the overall plant status.

These thresholds are defined for simulation purposes and do not represent universal industrial safety limits.

Technologies Used

Frontend

React JS

JavaScript (JSX)

Vite

React Router

React Hooks (useState, useEffect, useContext, useRef)

Context API

CSS and CSS Modules

SVG-based data visualizations

Backend and Persistence

Node.js

JSONBin.io

REST API (GET and PUT)

Browser localStorage

Application Architecture

PlantPulse uses reusable React components and centralized state management through the Context API.

PlantProvider manages system readings and event history, while the individual pages access shared data through PlantContext.

The Node.js backend acts as an intermediary between the React application and JSONBin, keeping the cloud API access key outside the frontend source code.

Getting Started

Prerequisites

Node.js and npm

A JSONBin.io account and configured data bin

A JSONBin access key with the necessary permissions

Installation

Clone or download the project repository.

Open the project folder in VS Code or a terminal.

Install dependencies:

npm install

Configure the backend environment variables in .env.local using the names expected by server/index.js. Do not commit this file or share your access key.

Start the Node.js backend:

node server/index.js

In another terminal, start the React development server:

npm run dev

Open the local URL displayed by Vite.

The React frontend communicates with the backend through the /api/plant endpoint.

Note: The JSONBin environment-variable names and Vite proxy configuration should be verified against the actual project files before publishing the repository.

How to Use

Open the Dashboard to view the current operating conditions.

Navigate to Update Reading and select a system and parameter.

Enter a new numerical value and submit.

Observe the updated status on the Dashboard and Active Alerts page.

View the recorded change in Event History.

Select the system in System Trends to view its status history.

Refresh the application to confirm data persistence.

Use Reset Demo to restore the initial readings and clear history.

Future Improvements

Integration with real industrial sensor data

Real-time monitoring through APIs or streaming connections

User authentication and role-based access

Configurable operating limits and alert thresholds

Advanced historical trends and analytics

Improved cloud synchronization and error recovery

Project Purpose

PlantPulse was developed to demonstrate React concepts through a practical industrial monitoring application, connecting Chemical Engineering and industrial operations knowledge with frontend development.

Disclaimer

PlantPulse is an educational simulation and is not intended for controlling or monitoring safety-critical industrial equipment.