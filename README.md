# Tumor Model Uygulaması

Bu proje, Hugging Face'den alınan tumor modelini kullanarak çalışan bir web uygulamasıdır.

## Kurulum

1. Modeli İndirme:
   ```bash
   # Model klasörünü oluştur
   mkdir -p model
   
   # Hugging Face'den modeli indir
   wget https://huggingface.co/agcaabdurrahim/tumor_model/resolve/main/my_model.keras -O model/my_model.keras
   ```

2. Docker ile Çalıştırma:
   ```bash
   # Docker Compose ile build ve başlatma
   docker-compose up --build
   ```

## Gereksinimler

- Docker
- Docker Compose

## Kullanım

Uygulama başlatıldıktan sonra `http://localhost:8000` adresinden erişilebilir.

## Notlar

- Model dosyası yaklaşık 254MB boyutundadır
- İlk indirme işlemi internet hızınıza bağlı olarak biraz zaman alabilir
- Docker build işlemi ilk seferde biraz uzun sürebilir