import torch
from transformers import AutoTokenizer, AutoModel

class EmbeddingGenerator:
    def __init__(self, model_name="microsoft/codebert-base"):
        self.model_name = model_name
        self.model = None  # Lazy load the model
        self.tokenizer = None

    def get_model(self):
        if self.model is None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model = self.model.half()  # Use float16 to reduce memory
        return self.model, self.tokenizer

    def generate_embedding(self, text):
        model, tokenizer = self.get_model()  # Load model only when needed
        tokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        
        with torch.no_grad():
            output = model(**tokens)

        return output.last_hidden_state.mean(dim=1)  # Mean pooling to get a single vector representation
