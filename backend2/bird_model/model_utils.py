import torch
import numpy as np
import timm
import librosa
import torch.nn.functional as F
import openvino as ov
from .config import SHAPE, MODEL_PATHS, LABELS

models = []

def mel(arr, sr=32_000):
    arr = arr * 1024
    spec = librosa.feature.melspectrogram(
        y=arr, sr=sr, n_fft=1024, hop_length=500,
        n_mels=128, fmin=40, fmax=15000, power=2.0
    )
    return spec.astype('float32')

def torch_to_ov(model):
    core = ov.Core()
    ov_model = ov.convert_model(model)
    compiled_model = core.compile_model(ov_model)
    return compiled_model

def load_models():
    global models
    for path in MODEL_PATHS:
        state_dict = torch.load(path, map_location=torch.device('cpu'))
        model = timm.create_model(
            'efficientnet_b0', pretrained=None,
            num_classes=182, in_chans=1
        )
        new_state_dict = {
            k[6:]: v for k, v in state_dict['state_dict'].items()
            if k.startswith('model.')
        }
        model.load_state_dict(new_state_dict)
        model.eval()
        models.append(torch_to_ov(model))
    print(f"✅ Loaded {len(models)} models")

def preprocess_audio(audio_path):
    audio, sr = librosa.load(audio_path, sr=None)
    chunk_size = sr * 5
    audio = audio[: (len(audio) // chunk_size) * chunk_size]
    chunks = audio.reshape(-1, chunk_size)
    chunks_mel = mel(chunks, sr=sr)[:, :, :320].astype(np.float32)

    chunks = chunks_mel[:, np.newaxis, :, :]
    chunks_1 = np.concatenate([chunks[:1], chunks[:-1]], axis=0)
    chunks_2 = np.concatenate([chunks[1:], chunks[-1:]], axis=0)
    chunks = np.concatenate([chunks_1, chunks, chunks_2], axis=-1)
    chunks = chunks[..., 160:-160]
    chunks = librosa.power_to_db(chunks, ref=1.0, top_db=100.0).astype('float32')
    return torch.from_numpy(chunks)

def predict(audio_path):
    chunks_tensor = preprocess_audio(audio_path)
    preds = []
    with torch.no_grad():
        for compiled_model in models:
            output = compiled_model(chunks_tensor)[0]
            pred = F.sigmoid(torch.Tensor(output)).numpy()
            preds.append(pred)
        preds = np.array(preds)
        avg_pred = preds.mean(axis=0).mean(axis=0)
        top_idx = np.argmax(avg_pred)
        top_label = LABELS[top_idx]
        confidence = avg_pred[top_idx]
    return top_label, float(confidence)
