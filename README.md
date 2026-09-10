# AIS Maritime Anomaly Detection

An AI-powered maritime surveillance system that analyzes AIS
(Automatic Identification System) data to detect potentially unusual
vessel behavior.

## 🚢 Project Overview

This project combines DataOps, Machine Learning, MLOps, FastAPI,
and a React dashboard to analyze vessel movement data and identify
potential AIS anomalies.

The system processes real AIS vessel movement data, performs data
cleaning and validation, engineers behavioral features, and uses an
Isolation Forest model to identify potentially unusual movement
patterns.
## Video







## 🏗️ System Architecture

```mermaid
flowchart TB

    A["🌊 AIS Public Dataset<br/>AegeaNET / Syros"] --> B["📥 Data Ingestion"]

    subgraph DATAOPS["⚙️ DataOps Pipeline"]
        B --> C["🧹 Data Cleaning"]
        C --> D["✅ Data Validation<br/>Pandera"]
        D --> E["🔧 Feature Engineering"]
    end

    subgraph FEATURES["📊 Vessel Movement Features"]
        E --> F["Speed Over Ground<br/>SOG"]
        E --> G["Course Over Ground<br/>COG"]
        E --> H["Time Gap"]
        E --> I["Distance Travelled"]
        E --> J["Speed Change"]
        E --> K["Circular Course Change"]
    end

    F --> L["🤖 Isolation Forest"]
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L

    subgraph ML["🧠 Machine Learning"]
        L --> M["Anomaly Detection"]
        M --> N["Anomaly Score"]
        M --> O["Potential Anomaly"]
    end

    subgraph MLOPS["🚀 MLOps"]
        L --> P["MLflow"]
        P --> Q["Experiment Tracking"]
        P --> R["Model Registry"]
        L --> S["Joblib Model"]
    end

    subgraph BACKEND["⚡ Backend API"]
        M --> T["FastAPI"]
        N --> T
        O --> T
        T --> U["/vessels"]
        T --> V["/predict"]
    end

    subgraph FRONTEND["🖥️ React Dashboard"]
        U --> W["React + TypeScript"]
        W --> X["🗺️ Leaflet Map"]
        W --> Y["📈 Surveillance Metrics"]
        W --> Z["🚨 Anomaly Alerts"]
        W --> AA["📍 Anomaly Details"]
    end

    AB["👤 User / Analyst"] --> W
