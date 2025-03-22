import hashlib
import pickle
import time
from collections import OrderedDict
import threading

class Cache:
    def __init__(self, max_size=1000, ttl=3600):
        self.store = OrderedDict()  # Maintain order for LRU eviction
        self.cache_ttl = ttl  # Time-to-live in seconds
        self.max_size = max_size  # Limit max items in cache
        self.lock = threading.Lock()  # Ensure thread safety

    def get_cache_key(self, data):
        return hashlib.md5(str(data).encode()).hexdigest()

    def get(self, key):
        with self.lock:
            if key in self.store:
                value, timestamp = self.store[key]
                if time.time() - timestamp < self.cache_ttl:
                    # Move accessed item to end (LRU behavior)
                    self.store.move_to_end(key)
                    return pickle.loads(value)
                else:
                    # Remove expired cache entry
                    del self.store[key]
        return None

    def set(self, key, value):
        with self.lock:
            if len(self.store) >= self.max_size:
                self.store.popitem(last=False)  # Remove the oldest item (LRU)
            self.store[key] = (pickle.dumps(value), time.time())  # Store with timestamp
