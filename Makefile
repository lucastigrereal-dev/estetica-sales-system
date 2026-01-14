.PHONY: up down logs restart

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

backend-logs:
	docker-compose logs -f backend

frontend-logs:
	docker-compose logs -f frontend
