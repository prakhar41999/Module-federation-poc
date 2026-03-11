# NX Monorepo Proof of Concept

This repository demonstrates a **proof of concept (POC)** for organizing all frontend applications within a single monorepo, managed by [NX](https://nx.dev/). The main goal is to streamline the development process by sharing and reusing common components and packages across multiple projects.

## Overview

- **Monorepo Structure**: Houses all frontend applications in one place, reducing duplication and enhancing consistency.
- **Shared Components**: Common components are developed once and used across different apps as internal packages.
- **Example Usage**: This approach is already implemented in `dtec-omb-admin`, where various packages—such as authentication, audit logs, Kafka integration, and gateway interaction—are developed to be reusable by multiple backend services.

## Benefits

- Easier maintenance and updates for shared code
- Faster setup for new applications
- Improved collaboration across teams

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run applications or build shared libraries as needed**

See individual application and package directories for more details.

## License

[Specify your license here]
