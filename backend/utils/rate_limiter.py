import os
from slowapi import Limiter
from slowapi.util import get_remote_address

RATE_ANALYZE = os.getenv("RATE_ANALYZE", "5/minute")
RATE_FEATURES_HVY = os.getenv("RATE_FEATURES_HVY", "10/minute")
RATE_FEATURES_LGT = os.getenv("RATE_FEATURES_LGT", "20/minute")
RATE_AUTH = os.getenv("RATE_AUTH", "10/minute")

limiter = Limiter(key_func=get_remote_address)
