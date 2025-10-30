FROM python:3.10-slim-bullseye as python

ENV DJANGO_SETTINGS_MODULE a.settings.local
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV DEBUG true

WORKDIR /app

COPY requirements.txt .

# Install dependencies
RUN apt-get update && apt-get install build-essential gcc python3-dev musl-dev libpq-dev python3-dev libpq-dev libffi-dev -y
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--reload", "--timeout=8000", "--workers=2", "a.wsgi:application"]
