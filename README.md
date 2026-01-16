🏰 Anadolu Fatihi: A Spatial Geography Challenge

[GMT 458 – Eren Dogu Firat - Anadolu Fatihi.pdf](https://github.com/user-attachments/files/24662898/GMT.458.Eren.Dogu.Firat.-.Anadolu.Fatihi.pdf)


Production URL (AWS): https://fatih.d7eotuva7xfmf.amplifyapp.com/

📜 Project Overview & Technical Compliance
1. User Engagement & Roles (20%) The application defines interaction levels through historical roles to match the game's atmosphere:

The Shahzade (Explorer): A trainee role allowing users to navigate Turkey's provinces and practice riddles without time pressure.

The Conqueror (Active Player): The primary competitive role where players engage in the 60-second "Expedition" to claim territories.

The Grand Vizier (Admin): The authoritative role responsible for managing the spatial database, riddle accuracy, and overall system integrity.

2. Access Management (15%)
Secure session management is used to validate player attempts.

Before entering the "Expedition," the system captures user session data to maintain a fair leaderboard of "Conquests" vs "Fails."

3. Dynamic Map Operations - CRUD (15%)
The system manages geographical features using dynamic processing:

Retrieval (Read): Fetches 81 complex spatial polygons from the NoSQL source in real-time.

Spatial Filtering: A custom logic is applied to the Leaflet layer to remove non-essential markers, providing a focused "Blind Map" experience.

Live Updates: Each correct guess updates the map’s styling properties dynamically to provide visual feedback (CSS animation injection).

4. NoSQL Data Architecture (25%)
Our data is structured in NoSQL-style documents (JSON), allowing the storage of irregular polygon coordinates alongside cultural metadata.

Architecture Value: Unlike SQL, this schema-less approach enables rapid spatial data parsing, ensuring zero-latency response during intense gameplay.

5. Performance Diagnostics (25% + 25%)
Continuous monitoring via Chrome Lighthouse confirms the project's optimization:

<img width="421" height="804" alt="Ekran görüntüsü 2026-01-14 225222" src="https://github.com/user-attachments/assets/e5dd83d7-8f45-42a6-99e7-0ef6edc09fc7" />




Efficiency: Achieved a 90+ performance score through optimized GeoJSON compression.

Speed: First Contentful Paint is under 0.8s, meaning the map is playable almost instantly after the intro.

Resilience: The game engine handles high-frequency event listeners (click/hover) on 81 separate vector features without frame loss.

6. Spatial Resource Management - API (25%)
The project utilizes a dedicated spatial data flow:

Data Fetching (GET): Systematically retrieves geographical boundaries from the integrated resource collection.

State Management: Coordinates are mapped to riddle IDs via a custom internal API logic, managing the flow of spatial challenges.

☁️ 7. Deployment - AWS Infrastructure (20%)
The environment is deployed on AWS Amplify, leveraging its automated CI/CD pipeline for high availability and low-latency asset delivery.
