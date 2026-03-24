# TraceBin: Waste Accountability & Tracking System

TraceBin is a smart waste accountability platform designed to track waste from the point of collection to the processing plant. It improves transparency, reduces leakage, and creates a traceable digital record for each waste collection event using QR-based identification, role-based dashboards, and audit-friendly workflows.

## Problem Statement

Traditional waste collection systems often face:
- Lack of end-to-end traceability
- No clear accountability between collection and disposal
- Difficulty detecting route deviation or possible leakage
- Limited transparency for authorities and citizens
- Manual record keeping and weak audit trails

## Solution

TraceBin provides a unified system where:
- Each bin is linked to a QR-based identity
- Collectors scan bins before pickup
- Trucks and collection activity are monitored
- Plant operators verify incoming waste
- A Waste Passport records the collection journey
- Authorities can monitor anomalies and operational status

## Core Features

- QR-based bin identification
- Collector dashboard for route and pickup operations
- Citizen-facing module for transparency and reporting
- Plant dashboard for verification and intake monitoring
- Waste Passport for chain-of-custody visibility
- Role-based access for different stakeholders
- Government-style portal UI for official presentation

## Workflow

### 1. Bin Identification
Each waste bin is assigned a unique QR code.

Example QR value:
BIN-1001

### 2. Collector Scan
The collector scans the bin QR code using the Collector Dashboard.

The system:
- reads the QR value
- identifies the bin
- fetches matching bin data
- shows bin details on screen

### 3. Pickup Confirmation
After scan validation, the collector confirms pickup.

This can later be extended with:
- geo-tagging
- image proof upload
- estimated weight entry

### 4. Truck Monitoring
Truck details such as:
- plate number
- deviation percentage
- route alerts
- location data

are shown in the Collector module.

### 5. Plant Verification
The Plant Dashboard allows verification of incoming waste batches and supports processing confirmation.

### 6. Waste Passport
Each collection event can be represented through a Waste Passport that contains:
- source
- truck
- collector
- waste type
- timestamps
- chain-of-custody history

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

### QR Scanning
- html5-qrcode

### Backend (planned / extendable)
- FastAPI or Node.js
- MongoDB

## system architecture
<p align="center">
  <img src="system%20architecture.png" width="600" alt="EcoTrace System Architecture">
</p>
