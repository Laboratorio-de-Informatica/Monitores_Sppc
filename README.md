# MoniTrack

Welcome to **MoniTrack**! This project is designed to automate and streamline the management of institutional monitors at the **Escuela Colombiana de Ingeniería**. Built with **Spring Boot**, this application provides a seamless and efficient way to track monitor sessions, manage students, and generate statistics.

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🧑‍💻 About the Project

**MoniTrack** is a tailored solution for the **Systems Engineering** department to facilitate the management of institutional monitors. This project aims to simplify the tracking process, providing an intuitive interface for administrators, monitors, and students.

### Key Objectives:

- **Automation**: Reduce manual intervention in the monitor session tracking process.
- **Efficiency**: Ensure quick and easy session logging without the need for complex procedures.
- **Transparency**: Provide clear statistics and reports on monitor activities.
- **Mass Import**: Allow administrators to import monitors from Excel files.

---

## ✨ Features

- **User Authentication**: Secure JWT-based login for students, monitors, and administrators.
- **Role-Based Access Control**: Differentiated access for ADMIN, MONITOR, and STUDENT roles.
- **Session Tracking**: Register monitor sessions with course, topic, start/end time.
- **Student Management**: Associate multiple students with each monitoring session.
- **Mass Import**: Import monitors from Excel (.xlsx) files.
- **Statistics & Reports**: Generate reports including average session duration, sessions per week, most active monitor, and students per session.
- **Admin Dashboard**: Manage monitors, sessions, and reports with ease.

---

## 🛠️ Tech Stack

- **Backend**: [Spring Boot 3.5.5](https://spring.io/projects/spring-boot)
- **Language**: [Java 17+](https://www.java.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa) + Hibernate
- **Security**: [Spring Security](https://spring.io/projects/spring-security) + JWT
- **Build Tool**: [Maven](https://maven.apache.org/)
- **Excel Processing**: [Apache POI](https://poi.apache.org/)
- **Containers**: [Docker](https://www.docker.com/) + Docker Compose

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Java 17+ installed. Download [Java](https://www.oracle.com/java/technologies/downloads/) if you haven't already.
- Maven 3.9+ installed. Download [Maven](https://maven.apache.org/download.cgi) if you haven't already.
- PostgreSQL installed (or use Docker). Download [PostgreSQL](https://www.postgresql.org/download/) or using [Docker](https://hub.docker.com/_/postgres)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Laboratorio-de-Informatica/Monitores_Sppc
   cd Monitores_Sppc
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other environment variables.

3. Start the application:

   **Option A - With Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   **Option B - Local execution:**
   ```bash
   ./mvnw spring-boot:run
   ```

---

## 📖 Usage

Once the server is running, you can access the API at `http://localhost:8082`. 


### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login and obtain JWT |
| GET | `/api/v1/monitors` | List all monitors |
| POST | `/api/v1/monitors` | Create monitor (ADMIN) |
| POST | `/api/v1/monitors/upload` | Import monitors from Excel (ADMIN) |
| POST | `/api/v1/logbooks` | Create monitoring session |
| GET | `/api/v1/logbooks/{id}` | Get session by ID |
| PUT | `/api/v1/logbooks/{id}/finish` | Finish session |
| POST | `/api/v1/logbooks/{id}/students` | Add student to session |
| GET | `/api/v1/statistics/average-duration` | Average session duration |
| GET | `/api/v1/statistics/sessions-per-week` | Sessions per week |
| GET | `/api/v1/statistics/top-monitor` | Most active monitor |
| GET | `/api/v1/statistics/students-by-session` | Students by session |

---

## 🤝 Contributing

Contributions are welcome! Only the Monitors team can contribute to this repository. If you would like to contribute, please write an email to the project maintainers.

**Contributors**

- Tulio Riaño Sánchez

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or further information, please contact:

- **Tulio Riaño** [tulio3101](https://github.com/tulio3101)
- **Email:** [labinfo@escuelaing.edu.co](mailto:labinfo@escuelaing.edu.co)
