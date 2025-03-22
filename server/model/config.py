# config.py
CONFIG = {
    'CACHE_TTL': 1800,  # Reduce TTL to free up memory faster
    'CACHE_MAX_SIZE': 5000,  # Limit cache entries to avoid excessive memory use
    'MAX_WORKERS': 4,  # Slightly reduce to avoid CPU overload
    'SIMILARITY_THRESHOLD': 0.15,  # Adjusted threshold for better filtering
    'REQUEST_TIMEOUT': 5,
    'BATCH_SIZE': 500,  # Reduce batch size to lower memory footprint
    'EMBEDDING_MODEL': 'paraphrase-MiniLM-L3-v2',  # Store model name for easy updates
    'USE_FP16': True,  # Enable half-precision (lower memory usage)
    'ASYNC_DOWNLOAD_LIMIT': 5  # Control concurrent file downloads to reduce memory spikes
}
