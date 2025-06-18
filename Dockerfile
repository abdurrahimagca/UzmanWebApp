# Stage 1: Backend (FastAPI)
FROM python:3.10-slim AS backend
WORKDIR /app
COPY model/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY model /app

# Stage 2: Frontend (Nginx)
FROM nginx:alpine AS frontend
WORKDIR /usr/share/nginx/html
COPY web /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Final stage: Compose both (optional, for reference)
# In production, use docker-compose to run backend and frontend as separate services.
