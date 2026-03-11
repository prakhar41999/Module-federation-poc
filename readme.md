# Shared Code Between Frontend Applications

This repository explores different approaches for sharing code across multiple frontend applications.

## Approaches

### 1. Runtime Code Sharing

- **[Module Federation + next-rspack](https://github.com/module-federation/next-rspack)**  
  Leverage Module Federation with next-rspack to dynamically share modules during runtime.

- **[Module Federation/next-mf](https://github.com/module-federation/next-mf)**  
  Utilize the next-mf plugin for runtime code sharing in Next.js applications.

### 2. Build Time Code Sharing

- **[Nx Monorepo](https://nx.dev/)**  
  Use the Nx monorepo tool to manage and share code between multiple frontend projects at build time.

- **npm Packages**  
  Publish and consume shared functionality as npm packages.

## Purpose

These approaches are provided as proofs of concept (POCs) to help evaluate strategies for efficient, scalable code sharing between frontend applications.