import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException, status
from app.config import settings


class InMemoryRateLimiter:
    """
    Sliding window in-memory rate limiter per IP address.
    """
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.client_records = defaultdict(deque)

    def check_rate_limit(self, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        window_start = now - 60.0

        timestamps = self.client_records[client_ip]

        # Purge timestamps older than 60 seconds
        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()

        if len(timestamps) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {self.requests_per_minute} requests per minute allowed."
            )

        timestamps.append(now)


rate_limiter = InMemoryRateLimiter(requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)
