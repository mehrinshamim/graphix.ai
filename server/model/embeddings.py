from sentence_transformers import SentenceTransformer
import torch

class EmbeddingGenerator:
    def __init__(self):
        self.model = None  # Lazy load the model

    def get_model(self):
        if self.model is None:
            self.model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
            self.model = self.model.half()  # Use float16 to reduce memory
        return self.model

    def generate_embedding(self, text):
        model = self.get_model()  # Load model only when needed
        return model.encode(text, convert_to_tensor=True)
