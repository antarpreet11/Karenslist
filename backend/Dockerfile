FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip

RUN apt update && apt install -y default-libmysqlclient-dev build-essential

ENV MYSQLCLIENT_CFLAGS="-I/usr/include/mysql"
ENV MYSQLCLIENT_LDFLAGS="-L/usr/lib/x86_64-linux-gnu -lmysqlclient"

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]
