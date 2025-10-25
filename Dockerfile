FROM python:3.10-slim-buster

WORKDIR /app

RUN apt-get update &&

apt-get install -y curl &&

curl -fsSL https://www.google.com/search?q=https://deb.nodesource.com/setup_20.x | bash - &&

apt-get install -y nodejs

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN cd client && npm install && npm run build

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]